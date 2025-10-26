import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Users, 
  Plus, 
  Edit, 
  AlertTriangle,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from "lucide-react";

const cargoOptions = [
  "Diretor Jurídico",
  "Vice-Diretor Jurídico", 
  "Chefe de Divisão",
  "Técnico"
];

const cargoColors = {
  "Diretor Jurídico": "bg-purple-100 text-purple-800",
  "Vice-Diretor Jurídico": "bg-indigo-100 text-indigo-800",
  "Chefe de Divisão": "bg-blue-100 text-blue-800",
  "Técnico": "bg-green-100 text-green-800"
};

// Helper function para formatar datas com segurança
const formatDateSafe = (dateValue) => {
  if (!dateValue) return "Data não informada";

  try {
    const date = new Date(dateValue);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

export default function Usuarios() {
  const [currentUser, setCurrentUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    cargo: "Técnico",
    ativo: true,
    setor: "",
    telefone: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [user, allUsers] = await Promise.all([
        User.me(),
        User.list("-created_date")
      ]);

      setCurrentUser(user);
      setUsuarios(allUsers);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage({ type: "error", text: "Erro ao carregar dados." });
    }
    setIsLoading(false);
  };

  const canEdit = () => {
    return currentUser && ["Diretor Jurídico", "Vice-Diretor Jurídico"].includes(currentUser.cargo);
  };

  const handleOpenModal = (usuario = null) => {
    if (!canEdit()) {
      setMessage({ type: "error", text: "Você não tem permissão para esta ação." });
      return;
    }

    if (usuario) {
      setSelectedUser(usuario);
      setFormData({
        full_name: usuario.full_name || "",
        email: usuario.email || "",
        cargo: usuario.cargo || "Técnico",
        ativo: usuario.ativo !== false,
        setor: usuario.setor || "",
        telefone: usuario.telefone || ""
      });
    } else {
      setSelectedUser(null);
      setFormData({
        full_name: "",
        email: "",
        cargo: "Técnico",
        ativo: true,
        setor: "",
        telefone: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      setMessage({ type: "error", text: "Nome e email são obrigatórios." });
      return;
    }

    try {
      if (selectedUser) {
        // Atualizar usuário existente
        await User.update(selectedUser.id, formData);
        setMessage({ type: "success", text: "Usuário atualizado com sucesso!" });
      } else {
        // Para demonstração, simular criação (não é possível criar usuários via API)
        setMessage({ type: "info", text: "Em produção, novos usuários são convidados via sistema de convites." });
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving user:", error);
      setMessage({ type: "error", text: "Erro ao salvar usuário." });
    }
  };

  const toggleUserStatus = async (usuario) => {
    if (!canEdit()) {
      setMessage({ type: "error", text: "Você não tem permissão para esta ação." });
      return;
    }

    try {
      await User.update(usuario.id, { ativo: !usuario.ativo });
      setMessage({ 
        type: "success", 
        text: `Usuário ${usuario.ativo ? 'desativado' : 'ativado'} com sucesso!` 
      });
      loadData();
    } catch (error) {
      console.error("Error toggling user status:", error);
      setMessage({ type: "error", text: "Erro ao alterar status do usuário." });
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCargo = filterCargo === "todos" || usuario.cargo === filterCargo;
    const matchesStatus = filterStatus === "todos" || 
                         (filterStatus === "ativo" && usuario.ativo !== false) ||
                         (filterStatus === "inativo" && usuario.ativo === false);
    
    return matchesSearch && matchesCargo && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">
            Gerenciar usuários do sistema SIGAJ
          </p>
        </div>
        {canEdit() && (
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Convidar Usuário
          </Button>
        )}
      </div>

      {message && (
        <Alert className={`${
          message.type === 'error' ? 'border-red-200 bg-red-50' : 
          message.type === 'success' ? 'border-green-200 bg-green-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className={
            message.type === 'error' ? 'text-red-800' : 
            message.type === 'success' ? 'text-green-800' :
            'text-blue-800'
          }>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select value={filterCargo} onValueChange={setFilterCargo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os cargos</SelectItem>
                  {cargoOptions.map(cargo => (
                    <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Lista de Usuários ({filteredUsuarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum usuário encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-semibold text-sm">
                              {usuario.full_name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {usuario.full_name}
                            </p>
                            {usuario.telefone && (
                              <p className="text-sm text-gray-500">{usuario.telefone}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{usuario.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${cargoColors[usuario.cargo] || 'bg-gray-100 text-gray-800'} border-0`}>
                          {usuario.cargo || "Não definido"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {usuario.setor || "Não definido"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          usuario.ativo !== false 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        } border-0`}>
                          {usuario.ativo !== false ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Inativo
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDateSafe(usuario.created_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {canEdit() && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenModal(usuario)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={usuario.ativo !== false ? "destructive" : "default"}
                                onClick={() => toggleUserStatus(usuario)}
                              >
                                {usuario.ativo !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Editar Usuário" : "Convidar Usuário"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Nome completo do usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Select
                value={formData.cargo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cargo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cargoOptions.map(cargo => (
                    <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input
                id="setor"
                value={formData.setor}
                onChange={(e) => setFormData(prev => ({ ...prev, setor: e.target.value }))}
                placeholder="Ex: Divisão de Contratos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="+244 923 456 789"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {selectedUser ? "Salvar" : "Convidar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}