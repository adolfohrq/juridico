import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, LogIn, Shield, CheckCircle } from "lucide-react";
import { User } from "@/entities/User";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Verifica se já está autenticado
    checkIfAuthenticated();
  }, []);

  const checkIfAuthenticated = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser) {
        // Usuário já autenticado, redireciona
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Não autenticado, permanece na página de login
      console.log("Usuário não autenticado");
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Executa o login (mock)
      const user = await User.login();

      if (user) {
        // Login bem-sucedido, redireciona para a página original ou dashboard
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Lado esquerdo - Branding e informações */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SIGAJ</h1>
                <p className="text-blue-100 text-sm">Sistema de Gestão de Aprovações Jurídicas</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight">
                Gestão Jurídica
                <br />
                Eficiente e Segura
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Controle Total</h3>
                    <p className="text-blue-100 text-sm">
                      Gerencie pareceres jurídicos com aprovações hierárquicas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Fluxo Organizado</h3>
                    <p className="text-blue-100 text-sm">
                      Acompanhe cada etapa do processo de forma transparente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Segurança</h3>
                    <p className="text-blue-100 text-sm">
                      Sistema com controle de acesso baseado em perfis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm">
              Desenvolvido para otimizar o fluxo de aprovações jurídicas
              em ambientes corporativos e governamentais.
            </p>
          </div>
        </div>

        {/* Lado direito - Formulário de login */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600">
              Faça login para acessar o sistema
            </p>
          </div>

          {/* Mensagem de redirecionamento */}
          {from !== "/dashboard" && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <Shield className="w-4 h-4 inline mr-2" />
                Você será redirecionado para:{" "}
                <code className="bg-amber-100 px-2 py-1 rounded text-xs">
                  {from}
                </code>
              </p>
            </div>
          )}

          {/* Informação sobre o sistema mock */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2 font-semibold">
              Sistema em Modo Demonstração
            </p>
            <p className="text-xs text-blue-700">
              Este é um ambiente de demonstração. Clique em "Entrar" para
              acessar o sistema com um usuário de teste.
            </p>
          </div>

          {/* Botão de login */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Entrar no Sistema
              </>
            )}
          </Button>

          {/* Informações de perfis disponíveis */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Perfis disponíveis no sistema:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Diretor Jurídico
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Vice-Diretor
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Chefe de Divisão
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                Técnico
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
