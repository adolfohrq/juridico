import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido";
import { LogAtividade } from "@/entities/LogAtividade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart3,
  Download,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  CalendarIcon,
  FileText,
  Users
} from "lucide-react";

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

export default function Relatorios() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedChefe, setSelectedChefe] = useState("todos");
  const [selectedTecnico, setSelectedTecnico] = useState("todos");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [currentUser, allPedidos, allLogs, allUsers] = await Promise.all([
        User.me(),
        Pedido.list("-created_date"),
        LogAtividade.list("-created_date"),
        User.list()
      ]);

      setUser(currentUser);
      setPedidos(allPedidos);
      setLogs(allLogs);
      setUsuarios(allUsers);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const canViewReports = () => {
    return user && ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão"].includes(user.cargo);
  };

  // Filtrar dados baseado nos filtros selecionados
  const getFilteredData = () => {
    return pedidos.filter(pedido => {
      const pedidoDate = new Date(pedido.created_date);
      const isInDateRange = pedidoDate >= dateRange.from && pedidoDate <= dateRange.to;
      
      const matchesChefe = selectedChefe === "todos" || pedido.atribuido_para_id === selectedChefe;
      const matchesTecnico = selectedTecnico === "todos" || pedido.atribuido_para_id === selectedTecnico;
      
      return isInDateRange && matchesChefe && matchesTecnico;
    });
  };

  // Calcular métricas
  const calculateMetrics = () => {
    const filteredPedidos = getFilteredData();
    const total = filteredPedidos.length;
    
    // Contagem por status
    const statusCount = {
      pendente: filteredPedidos.filter(p => p.status === "Pendente").length,
      emExecucao: filteredPedidos.filter(p => p.status === "Em Execução").length,
      emRevisao: filteredPedidos.filter(p => p.status.includes("Revisão")).length,
      aprovado: filteredPedidos.filter(p => p.status === "Aprovado").length,
      rejeitado: filteredPedidos.filter(p => p.status === "Rejeitado").length,
      devolvido: filteredPedidos.filter(p => p.status === "Devolvido para Correções").length
    };

    // Prazo vencido
    const hoje = new Date();
    const prazoVencido = filteredPedidos.filter(p => 
      p.prazo_conclusao && 
      new Date(p.prazo_conclusao) < hoje && 
      !["Aprovado", "Rejeitado"].includes(p.status)
    ).length;

    // Taxa de retrabalho (devolvidos)
    const taxaRetrabalho = total > 0 ? ((statusCount.devolvido / total) * 100).toFixed(1) : 0;

    // Tempo médio (simulado - em dias)
    const tempoMedio = filteredPedidos.length > 0 ? 
      Math.round(Math.random() * 10 + 5) : 0; // 5-15 dias simulado

    return {
      total,
      statusCount,
      prazoVencido,
      taxaRetrabalho,
      tempoMedio
    };
  };

  const exportData = () => {
    const filteredPedidos = getFilteredData();
    const csvData = filteredPedidos.map(pedido => ({
      Titulo: pedido.titulo,
      Status: pedido.status,
      Prioridade: pedido.prioridade,
      "Criado em": formatDateSafe(pedido.created_date, "dd/MM/yyyy"),
      Prazo: pedido.prazo_conclusao ? formatDateSafe(pedido.prazo_conclusao, "dd/MM/yyyy") : "Sem prazo"
    }));

    // Simular download CSV
    console.log("Exportando dados:", csvData);
    alert("Relatório exportado com sucesso! (Em produção seria feito o download do arquivo)");
  };

  const metrics = calculateMetrics();
  const chefes = usuarios.filter(u => u.cargo === "Chefe de Divisão");
  const tecnicos = usuarios.filter(u => u.cargo === "Técnico");

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!canViewReports()) {
    return (
      <div className="p-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 text-center">
              Você não tem permissão para visualizar relatórios. 
              <br />
              Entre em contato com a administração.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Análise de desempenho e métricas do sistema
          </p>
        </div>
        <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período - De</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Período - Até</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Chefe de Divisão</Label>
              <Select value={selectedChefe} onValueChange={setSelectedChefe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Chefes</SelectItem>
                  {chefes.map(chefe => (
                    <SelectItem key={chefe.id} value={chefe.id}>
                      {chefe.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Técnico</Label>
              <Select value={selectedTecnico} onValueChange={setSelectedTecnico}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Técnicos</SelectItem>
                  {tecnicos.map(tecnico => (
                    <SelectItem key={tecnico.id} value={tecnico.id}>
                      {tecnico.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
                <p className="text-xs text-gray-500 mt-1">No período selecionado</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.tempoMedio}</p>
                <p className="text-xs text-gray-500 mt-1">Dias para conclusão</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Retrabalho</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.taxaRetrabalho}%</p>
                <p className="text-xs text-gray-500 mt-1">Pedidos devolvidos</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <RotateCcw className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prazo Vencido</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.prazoVencido}</p>
                <p className="text-xs text-gray-500 mt-1">SLAs violados</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.statusCount).map(([status, count]) => {
                const percentage = metrics.total > 0 ? (count / metrics.total * 100).toFixed(1) : 0;
                const statusLabels = {
                  pendente: "Pendente",
                  emExecucao: "Em Execução", 
                  emRevisao: "Em Revisão",
                  aprovado: "Aprovado",
                  rejeitado: "Rejeitado",
                  devolvido: "Devolvido"
                };
                
                const statusColors = {
                  pendente: "bg-yellow-200",
                  emExecucao: "bg-purple-200",
                  emRevisao: "bg-orange-200", 
                  aprovado: "bg-green-200",
                  rejeitado: "bg-red-200",
                  devolvido: "bg-gray-200"
                };

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${statusColors[status]}`}></div>
                      <span className="text-sm font-medium">{statusLabels[status]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <Badge variant="outline" className="text-xs">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Desempenho por Usuário */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...chefes, ...tecnicos].slice(0, 5).map((usuario, index) => {
                const userPedidos = getFilteredData().filter(p => p.atribuido_para_id === usuario.id);
                const completed = userPedidos.filter(p => p.status === "Aprovado").length;
                
                return (
                  <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-sm">
                          {usuario.full_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{usuario.full_name}</p>
                        <p className="text-xs text-gray-500">{usuario.cargo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{completed}</p>
                      <p className="text-xs text-gray-500">concluídos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Executivo */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Performance Geral</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {metrics.total} pedidos processados no período</li>
                  <li>• Tempo médio de {metrics.tempoMedio} dias para conclusão</li>
                  <li>• {metrics.statusCount.aprovado} pedidos aprovados</li>
                  <li>• Taxa de retrabalho de {metrics.taxaRetrabalho}%</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pontos de Atenção</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {metrics.prazoVencido} pedidos com prazo vencido</li>
                  <li>• {metrics.statusCount.devolvido} pedidos devolvidos para correção</li>
                  <li>• {metrics.statusCount.pendente} pedidos ainda pendentes</li>
                  <li>• Monitorar gargalos na etapa de revisão</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}