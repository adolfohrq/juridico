import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido";
import { LogAtividade } from "@/entities/LogAtividade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCards from "../components/dashboard/StatsCards";
import RecentActivities from "../components/dashboard/RecentActivities";
import PedidosPorStatus from "../components/dashboard/PedidosPorStatus";
import UrgentTasks from "../components/dashboard/UrgentTasks";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Se o usuário não tem cargo definido, definir um padrão
      if (!currentUser.cargo) {
        await User.updateMyUserData({
          cargo: "Técnico",
          ativo: true,
          setor: "Departamento Jurídico"
        });
        currentUser.cargo = "Técnico";
      }
      
      const allPedidos = await Pedido.list("-created_date");
      
      // Filtrar pedidos baseado no perfil do usuário
      const filteredPedidos = filterPedidosByRole(allPedidos, currentUser);
      setPedidos(filteredPedidos);
      
      // Calcular estatísticas
      const calculatedStats = calculateStats(filteredPedidos, currentUser);
      setStats(calculatedStats);
      
      const recentActivities = await LogAtividade.list("-created_date", 10);
      setAtividades(recentActivities);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const filterPedidosByRole = (pedidos, user) => {
    switch (user.cargo) {
      case "Diretor Jurídico":
        return pedidos; // Vê todos os pedidos
      
      case "Vice-Diretor Jurídico":
        return pedidos.filter(p => 
          // Não vê pedidos atribuídos pelo Diretor diretamente a si mesmo
          !(p.criado_por_id !== user.id && p.atribuido_para_id && p.atribuido_para_id !== user.id)
        );
      
      case "Chefe de Divisão":
        return pedidos.filter(p => 
          p.atribuido_para_id === user.id || 
          p.criado_por_id === user.id ||
          p.status === "Pendente" // Pedidos que chegam automaticamente
        );
      
      case "Técnico":
        return pedidos.filter(p => 
          p.atribuido_para_id === user.id || 
          p.criado_por_id === user.id
        );
      
      default:
        return pedidos.filter(p => p.criado_por_id === user.id);
    }
  };

  const calculateStats = (pedidos, user) => {
    const total = pedidos.length;
    const pendentes = pedidos.filter(p => p.status === "Pendente").length;
    const emExecucao = pedidos.filter(p => p.status === "Em Execução").length;
    const emRevisao = pedidos.filter(p => p.status.includes("Revisão")).length;
    const aprovados = pedidos.filter(p => p.status === "Aprovado").length;
    const rejeitados = pedidos.filter(p => p.status === "Rejeitado").length;
    const meusPedidos = pedidos.filter(p => p.atribuido_para_id === user.id).length;
    
    // Calcular pedidos com prazo vencido
    const hoje = new Date();
    const prazoVencido = pedidos.filter(p => 
      p.prazo_conclusao && new Date(p.prazo_conclusao) < hoje && 
      !["Aprovado", "Rejeitado"].includes(p.status)
    ).length;

    return {
      total,
      pendentes,
      emExecucao,
      emRevisao,
      aprovados,
      rejeitados,
      meusPedidos,
      prazoVencido
    };
  };

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

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo(a), {user?.full_name} • {user?.cargo || "Usuário"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Último acesso</p>
          <p className="font-medium">{format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCards
          title="Total de Pedidos"
          value={stats.total || 0}
          icon={FileText}
          bgColor="from-blue-500 to-blue-600"
          textColor="text-blue-600"
          description="Todos os pedidos visíveis"
        />
        
        <StatsCards
          title="Meus Pedidos"
          value={stats.meusPedidos || 0}
          icon={Users}
          bgColor="from-green-500 to-green-600"
          textColor="text-green-600"
          description="Atribuídos a mim"
        />
        
        <StatsCards
          title="Em Execução"
          value={stats.emExecucao || 0}
          icon={Clock}
          bgColor="from-amber-500 to-amber-600"
          textColor="text-amber-600"
          description="Em andamento"
        />
        
        <StatsCards
          title="Prazo Vencido"
          value={stats.prazoVencido || 0}
          icon={AlertTriangle}
          bgColor="from-red-500 to-red-600"
          textColor="text-red-600"
          description="Requer atenção"
        />
      </div>

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PedidosPorStatus stats={stats} />
          <RecentActivities atividades={atividades} />
        </div>
        
        <div className="space-y-8">
          <UrgentTasks pedidos={pedidos} />
          
          {/* Resumo Rápido */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Resumo Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-lg text-green-600">{stats.aprovados || 0}</div>
                  <div className="text-green-700">Aprovados</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-lg text-blue-600">{stats.emRevisao || 0}</div>
                  <div className="text-blue-700">Em Revisão</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="font-bold text-lg text-amber-600">{stats.pendentes || 0}</div>
                  <div className="text-amber-700">Pendentes</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="font-bold text-lg text-red-600">{stats.rejeitados || 0}</div>
                  <div className="text-red-700">Rejeitados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}