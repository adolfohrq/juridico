import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido";
import { LogAtividade } from "@/entities/LogAtividade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Eye, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  MessageCircle,
  Calendar,
  User as UserIcon,
  ArrowRight,
  RotateCcw,
  Shield
} from "lucide-react";

const statusConfig = {
  "Pendente": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "Em Execução": { color: "bg-purple-100 text-purple-800", icon: RotateCcw },
  "Em Revisão": { color: "bg-orange-100 text-orange-800", icon: Eye },
  "Aprovado": { color: "bg-green-100 text-green-800", icon: CheckCircle },
  "Rejeitado": { color: "bg-red-100 text-red-800", icon: XCircle },
  "Devolvido para Correções": { color: "bg-gray-100 text-gray-800", icon: ArrowRight }
};

const priorityColors = {
  "Baixa": "bg-gray-100 text-gray-800",
  "Média": "bg-blue-100 text-blue-800",
  "Alta": "bg-amber-100 text-amber-800",
  "Urgente": "bg-red-100 text-red-800"
};

// Helper function para formatar datas com segurança
const formatDateSafe = (dateValue, formatStr = "dd/MM/yyyy", options = {}) => {
  if (!dateValue) return "Data não informada";

  try {
    const date = new Date(dateValue);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    return format(date, formatStr, options);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

export default function Pedidos() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    q: "",
    status: "Todos",
    responsavel: "Todos",
    prazo: "Todos"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user && pedidos) { // Permitir array vazio
      applyFilters();
    }
  }, [pedidos, filters, user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      setError(null);
      
      // Garantir que o usuário tem cargo definido
      let currentUser = await User.me();
      if (!currentUser.cargo) {
        // Fallback for users without a role, common in new sign-ups
        await User.updateMyUserData({
          cargo: "Técnico",
          setor: "Jurídico Geral",
          ativo: true
        });
        currentUser = await User.me();
      }
      setUser(currentUser);

      // Carregar dados de forma segura
      const [allPedidos, allUsers] = await Promise.all([
        Pedido.list("-updated_date").catch(() => []),
        User.list().catch(() => [])
      ]);

      setUsuarios(allUsers || []);
      
      // Aplicar filtro de permissão baseado no cargo
      const visiblePedidos = filterPedidosByRole(allPedidos || [], currentUser, allUsers || []);
      setPedidos(visiblePedidos);
      
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Ocorreu um erro ao carregar os dados. Tente novamente.");
      setPedidos([]); // Garantir que seja array vazio
      setUsuarios([]);
    }
    setIsLoading(false);
  };

  const filterPedidosByRole = (pedidos, user, allUsers) => {
    if (!user?.cargo || !Array.isArray(pedidos)) return [];

    try {
      switch (user.cargo) {
        case "Diretor Jurídico":
          return pedidos; // Vê todos os pedidos

        case "Vice-Diretor Jurídico":
          // Vice-Diretor vê todos exceto os que foram atribuídos diretamente pelo Diretor
          return pedidos.filter(p =>
            !(p.criado_por_id !== user.id && p.atribuido_para_id && p.atribuido_para_id !== user.id)
          );

        case "Chefe de Divisão":
          return pedidos.filter(p => {
            // Pode ver pedidos onde é o responsável
            if (p.atribuido_para_id === user.id) return true;

            // Pode ver pedidos que criou
            if (p.criado_por_id === user.id) return true;

            // Pode ver pedidos pendentes (chegam automaticamente)
            if (p.status === "Pendente") return true;

            // Pode ver pedidos de outros chefes do mesmo setor
            const responsavel = allUsers.find(u => u.id === p.atribuido_para_id);
            if (user.setor && responsavel?.setor === user.setor) return true;

            return false;
          });

        case "Técnico":
          return pedidos.filter(p => {
            // Pode ver pedidos onde é o responsável
            if (p.atribuido_para_id === user.id) return true;

            // Pode ver pedidos que criou
            if (p.criado_por_id === user.id) return true;

            // Pode visualizar outros técnicos do mesmo setor
            const responsavel = allUsers.find(u => u.id === p.atribuido_para_id);
            if (user.setor && responsavel?.setor === user.setor) return true;

            return false;
          });

        default:
          // Default behavior for other roles, e.g., only see their own created pedidos
          return pedidos.filter(p => p.criado_por_id === user.id);
      }
    } catch (error) {
      console.error("Error filtering pedidos:", error);
      return [];
    }
  };

  const applyFilters = () => {
    try {
      let filtered = [...(pedidos || [])];

      // Filtro por texto
      if (filters.q.trim()) {
        const searchTerm = filters.q.toLowerCase();
        filtered = filtered.filter(p => 
          (p.titulo || "").toLowerCase().includes(searchTerm) ||
          (p.descricao || "").toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por status
      if (filters.status !== "Todos") {
        filtered = filtered.filter(p => p.status === filters.status);
      }

      // Filtro por responsável
      if (filters.responsavel !== "Todos") {
        if (filters.responsavel === "Eu") {
          filtered = filtered.filter(p =>
            p.criado_por_id === user.id ||
            p.atribuido_para_id === user.id
          );
        } else {
          // Filtrar por usuário específico
          filtered = filtered.filter(p =>
            p.criado_por_id === filters.responsavel ||
            p.atribuido_para_id === filters.responsavel
          );
        }
      }

      // Filtro por prazo
      if (filters.prazo !== "Todos") {
        const hoje = new Date();

        if (filters.prazo === "Vencido") {
          filtered = filtered.filter(p =>
            p.prazo_conclusao && isBefore(new Date(p.prazo_conclusao), hoje)
          );
        } else if (filters.prazo === "Próximos 7 dias") {
          const limite7 = addDays(hoje, 7);
          filtered = filtered.filter(p =>
            p.prazo_conclusao &&
            isAfter(new Date(p.prazo_conclusao), hoje) &&
            isBefore(new Date(p.prazo_conclusao), limite7)
          );
        } else if (filters.prazo === "Próximos 30 dias") {
          const limite30 = addDays(hoje, 30);
          filtered = filtered.filter(p =>
            p.prazo_conclusao &&
            isAfter(new Date(p.prazo_conclusao), hoje) &&
            isBefore(new Date(p.prazo_conclusao), limite30)
          );
        }
      }

      setFilteredPedidos(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredPedidos([]);
    }
  };

  const openPedidoDetails = async (pedido) => {
    try {
      setSelectedPedido(pedido);
      const pedidoLogs = await LogAtividade.filter({ pedido_id: pedido.id }, "-created_date").catch(() => []);
      setLogs(pedidoLogs);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading pedido details:", error);
      setMessage({ type: "error", text: "Erro ao carregar detalhes do pedido." });
    }
  };

  const handleStatusChange = async (pedido, newStatus, comment = "") => {
    try {
      const updateData = { 
        status: newStatus,
        updated_date: new Date().toISOString()
      };

      await Pedido.update(pedido.id, updateData);

      await LogAtividade.create({
        pedido_id: pedido.id,
        usuario_id: user.id,
        acao: "StatusAlterado",
        comentario: comment || `Status alterado para ${newStatus}`,
        status_anterior: pedido.status,
        status_novo: newStatus
      });

      setMessage({ type: "success", text: "Status alterado com sucesso!" });
      setIsModalOpen(false);
      loadData(); // Recarregar dados
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ type: "error", text: "Erro ao alterar status." });
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await LogAtividade.create({
        pedido_id: selectedPedido.id,
        usuario_id: user.id,
        acao: "Comentario",
        comentario: newComment
      });

      setNewComment("");
      
      // Reload logs
      const pedidoLogs = await LogAtividade.filter({ pedido_id: selectedPedido.id }, "-created_date").catch(() => []);
      setLogs(pedidoLogs);
      
      setMessage({ type: "success", text: "Comentário adicionado!" });
    } catch (error) {
      console.error("Error adding comment:", error);
      setMessage({ type: "error", text: "Erro ao adicionar comentário." });
    }
  };

  const canPerformAction = (action, pedido) => {
    if (!user?.cargo) return false;

    switch (action) {
      case "aceitar":
        return user.cargo === "Chefe de Divisão" && pedido.status === "Pendente";

      case "concluir":
        return user.cargo === "Técnico" && pedido.status === "Em Execução" && pedido.atribuido_para_id === user.id;

      case "aprovar":
        return (user.cargo === "Chefe de Divisão" && pedido.status === "Em Revisão" && pedido.atribuido_para_id === user.id) ||
               (["Diretor Jurídico", "Vice-Diretor Jurídico"].includes(user.cargo) && pedido.status === "Em Revisão");

      case "devolver":
        return (user.cargo === "Chefe de Divisão" && pedido.status === "Em Revisão" && pedido.atribuido_para_id === user.id) ||
               (["Diretor Jurídico", "Vice-Diretor Jurídico"].includes(user.cargo) && pedido.status === "Em Revisão");

      default:
        return false;
    }
  };

  const getActionButtons = (pedido) => {
    const buttons = [];

    if (canPerformAction("aceitar", pedido)) {
      buttons.push(
        <Button
          key="aceitar"
          size="sm"
          onClick={() => {
            handleStatusChange(pedido, "Em Execução", `Pedido aceito por ${user?.cargo}`);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Aceitar
        </Button>
      );
    }

    if (canPerformAction("concluir", pedido)) {
      buttons.push(
        <Button
          key="concluir"
          size="sm"
          onClick={() => handleStatusChange(pedido, "Em Revisão", "Pedido concluído e enviado para revisão")}
          className="bg-green-600 hover:bg-green-700"
        >
          Concluir
        </Button>
      );
    }

    if (canPerformAction("aprovar", pedido)) {
      buttons.push(
        <Button
          key="aprovar"
          size="sm"
          onClick={() => handleStatusChange(pedido, "Aprovado", "Pedido aprovado")}
          className="bg-green-600 hover:bg-green-700"
        >
          Aprovar
        </Button>
      );
    }

    if (canPerformAction("devolver", pedido)) {
      buttons.push(
        <Button
          key="devolver"
          size="sm"
          variant="destructive"
          onClick={() => handleStatusChange(pedido, "Devolvido para Correções", "Pedido devolvido para correções")}
        >
          Devolver
        </Button>
      );
    }

    return buttons;
  };

  const getResponsavelName = (pedido) => {
    const responsavelId = pedido.atribuido_para_id || pedido.criado_por_id;
    const responsavel = usuarios.find(u => u.id === responsavelId);
    return responsavel?.full_name || "Não atribuído";
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-1">
            Gerenciar pareceres e documentos jurídicos
          </p>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Título ou descrição..."
                value={filters.q}
                onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {Object.keys(statusConfig).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select value={filters.responsavel} onValueChange={(value) => setFilters(prev => ({ ...prev, responsavel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Eu">Eu</SelectItem>
                  {usuarios.map(usuario => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prazo</Label>
              <Select value={filters.prazo} onValueChange={(value) => setFilters(prev => ({ ...prev, prazo: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                  <SelectItem value="Próximos 7 dias">Próximos 7 dias</SelectItem>
                  <SelectItem value="Próximos 30 dias">Próximos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Lista de Pedidos ({(filteredPedidos || []).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredPedidos || filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum pedido encontrado</p>
                      <p className="text-sm mt-1">Tente ajustar os filtros ou aguarde novas atribuições.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((pedido) => {
                    const StatusIcon = statusConfig[pedido.status]?.icon || Clock;
                    const isOverdue = pedido.prazo_conclusao && isBefore(new Date(pedido.prazo_conclusao), new Date());

                    return (
                      <TableRow 
                        key={pedido.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openPedidoDetails(pedido)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{pedido.titulo || "Sem título"}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {pedido.descricao || "Sem descrição"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[pedido.status]?.color || 'bg-gray-100 text-gray-800'} border-0`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {pedido.status || "Desconhecido"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${priorityColors[pedido.prioridade] || 'bg-gray-100 text-gray-800'} border-0`}>
                            {pedido.prioridade || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{getResponsavelName(pedido)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pedido.prazo_conclusao ? (
                            <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              <Calendar className="w-4 h-4" />
                              {formatDateSafe(pedido.prazo_conclusao, "dd/MM/yyyy")}
                              {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 ml-1" title="Prazo vencido" />}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDateSafe(pedido.updated_date || pedido.created_date, "dd/MM/yyyy")}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openPedidoDetails(pedido)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {getActionButtons(pedido)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {selectedPedido?.titulo || "Detalhes do Pedido"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPedido && (
            <div className="space-y-6">
              {/* Informações do Pedido */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Descrição</Label>
                    <p className="mt-1 text-gray-900">{selectedPedido.descricao}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status Atual</Label>
                    <div className="mt-1">
                      <Badge className={`${statusConfig[selectedPedido.status]?.color || 'bg-gray-100 text-gray-800'} border-0`}>
                        {selectedPedido.status || "Desconhecido"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prioridade</Label>
                    <div className="mt-1">
                      <Badge className={`${priorityColors[selectedPedido.prioridade] || 'bg-gray-100 text-gray-800'} border-0`}>
                        {selectedPedido.prioridade || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  {selectedPedido.prazo_conclusao && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Prazo</Label>
                      <p className="mt-1 text-gray-900">
                        {formatDateSafe(selectedPedido.prazo_conclusao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline de Atividades */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline de Atividades</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {(!logs || logs.length === 0) ? (
                    <p className="text-gray-500 text-sm">Nenhuma atividade registrada</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={log.id || index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {log.acao}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDateSafe(log.created_date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900">{log.comentario}</p>
                          {log.status_anterior && log.status_novo && (
                            <p className="text-xs text-gray-500 mt-1">
                              {log.status_anterior} → {log.status_novo}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Adicionar Comentário */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-gray-700">Adicionar Comentário</Label>
                <div className="flex gap-2 mt-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Digite seu comentário..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={addComment} disabled={!newComment.trim()}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-2 border-t pt-4">
                {getActionButtons(selectedPedido)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
