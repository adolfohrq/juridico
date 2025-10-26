import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido";
import { Atribuicao } from "@/entities/Atribuicao";
import { LogAtividade } from "@/entities/LogAtividade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Save, FileText, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NovoParecer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chefes, setChefes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo_documento: "Parecer Jurídico",
    prioridade: "Média",
    prazo_conclusao: null,
    atribuir_para: "",
    observacoes: ""
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const currentUser = await User.me();

      // Se o usuário não tem cargo definido, definir um padrão
      if (!currentUser.cargo) {
        await User.updateMyUserData({
          cargo: "Diretor Jurídico", // Para demonstração, definir como Diretor
          ativo: true,
          setor: "Direção Jurídica"
        });
        currentUser.cargo = "Diretor Jurídico";
      }

      // Verificar se é Diretor ou Vice-Diretor
      if (!["Diretor Jurídico", "Vice-Diretor Jurídico"].includes(currentUser.cargo)) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      setUser(currentUser);
      
      // Buscar todos os usuários para filtrar chefes
      const allUsers = await User.list();
      const chefesDivisao = allUsers.filter(u => 
        u.cargo === "Chefe de Divisão" && u.ativo !== false
      );
      setChefes(chefesDivisao);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage({ type: "error", text: "Erro ao carregar dados iniciais." });
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      setMessage({ type: "error", text: "Por favor, preencha todos os campos obrigatórios." });
      return;
    }

    setIsSaving(true);
    
    try {
      // Criar o pedido
      const novoPedido = await Pedido.create({
        ...formData,
        criado_por_id: user.id,
        atribuido_para_id: formData.atribuir_para || null,
        status: "Pendente"
      });

      // Criar atribuição inicial se foi especificada
      if (formData.atribuir_para) {
        await Atribuicao.create({
          pedido_id: novoPedido.id,
          usuario_id: formData.atribuir_para,
          papel: "Revisor",
          atribuido_por_id: user.id,
          comentario: `Pedido atribuído para análise inicial`
        });
      }

      // Registrar log de criação
      await LogAtividade.create({
        pedido_id: novoPedido.id,
        usuario_id: user.id,
        acao: "Criado",
        comentario: `Novo parecer criado: ${formData.titulo}`,
        status_novo: "Pendente"
      });

      setMessage({ type: "success", text: "Parecer criado com sucesso!" });
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
      
    } catch (error) {
      console.error("Error creating pedido:", error);
      setMessage({ type: "error", text: "Erro ao criar parecer. Tente novamente." });
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Parecer</h1>
        <p className="text-gray-600">
          Criar um novo pedido de parecer ou documento jurídico
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Informações do Parecer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ex: Análise contratual do projeto X"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                <Select
                  value={formData.tipo_documento}
                  onValueChange={(value) => handleInputChange("tipo_documento", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parecer Jurídico">Parecer Jurídico</SelectItem>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Petição">Petição</SelectItem>
                    <SelectItem value="Recurso">Recurso</SelectItem>
                    <SelectItem value="Análise Legal">Análise Legal</SelectItem>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descreva detalhadamente o que precisa ser analisado..."
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => handleInputChange("prioridade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prazo de Conclusão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.prazo_conclusao ? 
                        format(formData.prazo_conclusao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) :
                        "Selecionar data"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.prazo_conclusao}
                      onSelect={(date) => handleInputChange("prazo_conclusao", date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atribuir_para">Atribuir Para (Chefe de Divisão)</Label>
              <Select
                value={formData.atribuir_para}
                onValueChange={(value) => handleInputChange("atribuir_para", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um Chefe de Divisão ou deixe em branco" />
                </SelectTrigger>
                <SelectContent>
                  {chefes.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      Nenhum Chefe de Divisão encontrado
                    </div>
                  ) : (
                    chefes.map((chefe) => (
                      <SelectItem key={chefe.id} value={chefe.id}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {chefe.full_name} - {chefe.setor || "Sem setor definido"}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Se não selecionado, será enviado automaticamente para análise
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange("observacoes", e.target.value)}
                placeholder="Informações adicionais, contexto, orientações específicas..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Parecer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}