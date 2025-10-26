import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { User } from "@/entities/User";
import { Scale } from "lucide-react";

/**
 * ProtectedRoute Component
 * Protege rotas verificando autenticação e autorização por role
 *
 * @param {React.ReactNode} children - Componente filho a ser renderizado se autorizado
 * @param {string[]} allowedRoles - Array de roles permitidos para acessar a rota (opcional)
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();

      if (!currentUser) {
        setUser(null);
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Auto-assign role se não tiver (comportamento legacy)
      if (!currentUser.cargo) {
        await User.updateMyUserData({
          cargo: "Técnico",
          ativo: true,
          setor: "Setor Geral"
        });
        currentUser.cargo = "Técnico";
      }

      setUser(currentUser);

      // Se não há restrições de roles, permite acesso
      if (allowedRoles.length === 0) {
        setIsAuthorized(true);
      } else {
        // Verifica se o role do usuário está na lista de permitidos
        setIsAuthorized(allowedRoles.includes(currentUser.cargo));
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setUser(null);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Exibe loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login (root)
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Se está autenticado mas não tem permissão, redireciona para página de acesso negado
  if (!isAuthorized) {
    return <Navigate to="/acesso-negado" replace state={{ from: location }} />;
  }

  // Se passou em todas as verificações, renderiza o componente filho
  return children;
}
