import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido"; 
import { LogAtividade } from "@/entities/LogAtividade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Activity, 
  Filter, 
  Eye,
  CalendarIcon,
  FileText,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Upload,
  RotateCcw
} from "lucide-react";

const actionIcons = {
  "Criado": FileText,
  "Atribuído": UserCheck,
  "Status Alterado": Clock,
  "Aprovado": CheckCircle,
  "Rejeitado": XCircle,
  "Comentário Adicionado": MessageCircle,
  "Documento Adicionado": Upload,
  "Revisado": RotateCcw,
  "Devolvido": XCircle
};

const actionColors = {
  "Criado": "bg-blue-100 text-blue-800",
  "Atribuído": "bg-purple-100 text-purple-800",
  "Status Alterado": "bg-amber-100 text-amber-800",
  "Aprovado": "bg-green-100 text-green-800",
  "Rejeitado": "bg-red-100 text-red-800",
  "Comentário Adicionado": "bg-gray-100 text-gray-800",
  "Documento Adicionado": "bg-indigo-100 text-indigo-800",
  "Revisado": "bg-orange-100 text-orange-800",
  "Devolvido": "bg-red-100 text-red-800"
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

export default function Atividades() {
  const [user, setUser] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [filteredAtividades, setFilteredAtividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    usuario: "todos",
    acao: "todas",
    periodo: "7dias",
    search: "",
    customDateFrom: null,
    customDateTo: null
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [atividades, filters]);

  const loadData = async () => {
    try {
      const [currentUser, allLogs, allUsers, allPedidos] = await Promise.all([
        User.me(),
        LogAtividade.list("-created_date", 100),
        User.list(),
        Pedido.list()
      ]);

      setUser(currentUser);
      setAtividades(allLogs);
      setUsuarios(allUsers);
      setPedidos(allPedidos);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...atividades];

    // Filtro por usuário
    if (filters.usuario !== "todos") {
      filtered = filtered.filter(a => a.usuario_id === filters.usuario);
    }

    // Filtro por ação
    if (filters.acao !== "todas") {
      filtered = filtered.filter(a => a.acao === filters.acao);
    }

    // Filtro por período
    if (filters.periodo !== "personalizado") {
      const hoje = new Date();
      let dataLimite;
      
      switch (filters.periodo) {
        case "hoje":
          dataLimite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
          break;
        case "7dias":
          dataLimite = subDays(hoje, 7);
          break;
        case "30dias":
          dataLimite = subDays(hoje, 30);
          break;
        default:
          dataLimite = null;
      }
      
      if (dataLimite) {
        filtered = filtered.filter(a => new Date(a.created_date) >= dataLimite);
      }
    } else {
      // Período personalizado
      if (filters.customDateFrom) {
        filtered = filtered.filter(a => new Date(a.created_date) >= filters.customDateFrom);
      }
      if (filters.customDateTo) {
        filtered = filtered.filter(a => new Date(a.created_date) <= filters.customDateTo);
      }
    }

    // Filtro por busca
    if (filters.search) {
      filtered = filtered.filter(a => 
        a.comentario?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.acao.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredAtividades(filtered);
  };

  const openPedidoDetails = async (pedidoId) => {
    try {
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (pedido) {
        setSelectedPedido(pedido);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading pedido details:", error);
    }
  };

  const getUsuarioNome = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario?.full_name || "Usuário não encontrado";
  };

  const getPedidoTitulo = (pedidoId) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    return pedido?.titulo || "Pedido não encontrado";
  };

  const uniqueAcoes = [...new Set(atividades.map(a => a.acao))];

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
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-600 mt-1">
            Feed cronológico de todas as atividades do sistema
          </p>
        </div>
      </div>

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
                placeholder="Comentário ou ação..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Select value={filters.usuario} onValueChange={(value) => setFilters(prev => ({ ...prev, usuario: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  {usuarios.map(usuario => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ação</Label>
              <Select value={filters.acao} onValueChange={(value) => setFilters(prev => ({ ...prev, acao: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as ações</SelectItem>
                  {uniqueAcoes.map(acao => (
                    <SelectItem key={acao} value={acao}>{acao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={filters.periodo} onValueChange={(value) => setFilters(prev => ({ ...prev, periodo: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="personalizado">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros de data personalizados */}
          {filters.periodo === "personalizado" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Data inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.customDateFrom ? 
                        format(filters.customDateFrom, "dd/MM/yyyy") :
                        "Selecionar data"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.customDateFrom}
                      onSelect={(date) => setFilters(prev => ({ ...prev, customDateFrom: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.customDateTo ? 
                        format(filters.customDateTo, "dd/MM/yyyy") :
                        "Selecionar data"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single" 
                      selected={filters.customDateTo}
                      onSelect={(date) => setFilters(prev => ({ ...prev, customDateTo: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feed de Atividades */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Feed de Atividades ({filteredAtividades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAtividades.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
                <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
              </div>
            ) : (
              filteredAtividades.map((atividade, index) => {
                const IconComponent = actionIcons[atividade.acao] || Activity;
                const usuario = usuarios.find(u => u.id === atividade.usuario_id);
                const pedido = pedidos.find(p => p.id === atividade.pedido_id);
                
                return (
                  <div key={atividade.id || index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      {index < filteredAtividades.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${actionColors[atividade.acao]} border-0 text-xs`}>
                          {atividade.acao}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(atividade.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          {pedido && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openPedidoDetails(atividade.pedido_id)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Pedido
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {usuario?.full_name || "Usuário não encontrado"} • {usuario?.cargo}
                        </p>
                        
                        <p className="text-sm text-gray-700">
                          {atividade.comentario || `${atividade.acao} no pedido`}
                        </p>
                        
                        {pedido && (
                          <p className="text-xs text-gray-500">
                            Pedido: {pedido.titulo}
                          </p>
                        )}
                        
                        {atividade.status_anterior && atividade.status_novo && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <Badge variant="outline" className="h-5 text-xs">
                              {atividade.status_anterior}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="h-5 text-xs">
                              {atividade.status_novo}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {selectedPedido?.titulo}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPedido && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Descrição</Label>
                  <p className="mt-1 text-gray-900">{selectedPedido.descricao}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedPedido.status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Prioridade</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedPedido.prioridade}</Badge>
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

              <div>
                <Label className="text-sm font-medium text-gray-500">Criado em</Label>
                <p className="mt-1 text-gray-900">
                  {formatDateSafe(selectedPedido.created_date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}