import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Pedido } from "@/entities/Pedido";
import { 
  FileText, 
  LayoutDashboard, 
  Users, 
  Plus, 
  Activity,
  BarChart3,
  Bell,
  Scale,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Mapeia os cargos do backend (enum Prisma) para os nomes legíveis do frontend
 */
const CARGO_MAP = {
  "DIRETOR_JURIDICO": "Diretor Jurídico",
  "VICE_DIRETOR_JURIDICO": "Vice-Diretor Jurídico",
  "CHEFE_DIVISAO": "Chefe de Divisão",
  "TECNICO": "Técnico"
};

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão", "Técnico"],
    badge: "dashboard"
  },
  {
    title: "Pedidos",
    url: createPageUrl("Pedidos"),
    icon: FileText,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão", "Técnico"],
    badge: "pedidos"
  },
  {
    title: "Novo Parecer",
    url: createPageUrl("NovoParecer"),
    icon: Plus,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico"]
  },
  {
    title: "Usuários",
    url: createPageUrl("Usuarios"),
    icon: Users,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão", "Técnico"]
  },
  {
    title: "Relatórios",
    url: createPageUrl("Relatorios"),
    icon: BarChart3,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão"]
  },
  {
    title: "Atividades",
    url: createPageUrl("Atividades"),
    icon: Activity,
    roles: ["Diretor Jurídico", "Vice-Diretor Jurídico", "Chefe de Divisão", "Técnico"]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      // ProtectedRoute já garante que há um usuário autenticado
      // Não é necessário verificar novamente
      if (currentUser && !currentUser.cargo) {
        await User.updateMyUserData({
          cargo: "Técnico",
          ativo: true,
          setor: "Setor Geral"
        });
        currentUser.cargo = "Técnico";
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      // Se houver erro, o ProtectedRoute lidará com isso
    } finally {
      setIsLoading(false);
    }
  };

  const loadBadges = async () => {
    try {
      const pedidos = await Pedido.list();
      const meusPedidos = pedidos.filter(p => p.atribuido_para_id === user.id);
      const pendentes = meusPedidos.filter(p => p.status === "Pendente").length;
      const emExecucao = meusPedidos.filter(p => p.status === "Em Execução").length;
      const emRevisao = meusPedidos.filter(p => p.status.includes("Revisão")).length;
      
      setBadges({
        dashboard: pendentes + emExecucao + emRevisao || null,
        pedidos: meusPedidos.length || null
      });
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  };

  const handleLogout = async () => {
    await User.logout();
    // Redireciona para a página de login
    navigate("/", { replace: true });
  };

  // Mapeia o cargo do backend para o formato legível antes de filtrar
  const cargoLegivel = user ? (CARGO_MAP[user.cargo] || user.cargo) : null;

  const filteredNavigation = navigationItems.filter(item =>
    user && item.roles.includes(cargoLegivel)
  );

  // Log para debug
  if (user) {
    console.log('🎯 Menu filtrado:', {
      cargoBackend: user.cargo,
      cargoMapeado: cargoLegivel,
      itensVisiveis: filteredNavigation.map(i => i.title)
    });
  }

  // Loading state simplificado - ProtectedRoute já gerencia autenticação
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <style>
          {`
            :root {
              --sigaj-primary: #1e40af;
              --sigaj-primary-dark: #1d4ed8;
              --sigaj-secondary: #f8fafc;
              --sigaj-accent: #d97706;
              --sigaj-text: #1e293b;
              --sigaj-text-light: #64748b;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">SIGAJ</h2>
                <p className="text-xs text-gray-500">Gestão Jurídica</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                          {item.badge && badges[item.badge] && (
                            <Badge className="ml-auto bg-amber-500 text-white text-xs">
                              {badges[item.badge]}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Sistema Online</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Notificações</span>
                    <Badge variant="secondary" className="ml-auto">{badges.dashboard || 0}</Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">
                  {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user.cargo}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-bold text-gray-900">SIGAJ</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}