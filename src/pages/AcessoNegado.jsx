import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft, Scale } from "lucide-react";
import { User } from "@/entities/User";

export default function AcessoNegado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
        <div className="text-center">
          {/* Ícone de Alerta */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Acesso Negado
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 mb-2">
            Você não possui permissão para acessar esta página.
          </p>

          {/* Informações do usuário */}
          {user && (
            <div className="bg-slate-50 rounded-lg p-4 my-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-sm text-gray-600">{user.cargo}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Seu perfil não tem autorização para acessar esta funcionalidade.
              </p>
            </div>
          )}

          {/* Informação sobre a página tentada */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Página solicitada:</span>{" "}
              <code className="bg-amber-100 px-2 py-1 rounded text-xs">
                {from}
              </code>
            </p>
          </div>

          {/* Mensagem de ajuda */}
          <p className="text-sm text-gray-500 mb-8">
            Se você acredita que deveria ter acesso a esta página, entre em
            contato com o administrador do sistema ou com o Diretor Jurídico.
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 h-11"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Button>
          </div>
        </div>

        {/* Footer com branding */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Scale className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">SIGAJ</span>
            <span>|</span>
            <span>Sistema de Gestão de Aprovações Jurídicas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
