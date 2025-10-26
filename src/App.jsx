import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import NovoParecer from "@/pages/NovoParecer";
import Usuarios from "@/pages/Usuarios";
import Relatorios from "@/pages/Relatorios";
import Atividades from "@/pages/Atividades";
import AcessoNegado from "@/pages/AcessoNegado";
import Login from "@/pages/Login";
import GoogleCallback from "@/pages/GoogleCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login - Página inicial */}
        <Route path="/" element={<Login />} />

        {/* Callback do Google OAuth */}
        <Route path="/auth/callback" element={<GoogleCallback />} />

        {/* Página de Acesso Negado */}
        <Route path="/acesso-negado" element={<AcessoNegado />} />

        {/* Dashboard - Todos os usuários autenticados */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Diretor Jurídico",
                "Vice-Diretor Jurídico",
                "Chefe de Divisão",
                "Técnico"
              ]}
            >
              <Layout currentPageName="Dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Pedidos - Todos os usuários autenticados */}
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Diretor Jurídico",
                "Vice-Diretor Jurídico",
                "Chefe de Divisão",
                "Técnico"
              ]}
            >
              <Layout currentPageName="Pedidos">
                <Pedidos />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Novo Parecer - Apenas Diretor e Vice-Diretor */}
        <Route
          path="/novoparecer"
          element={
            <ProtectedRoute
              allowedRoles={["Diretor Jurídico", "Vice-Diretor Jurídico"]}
            >
              <Layout currentPageName="NovoParecer">
                <NovoParecer />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Usuários - Todos os usuários autenticados */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Diretor Jurídico",
                "Vice-Diretor Jurídico",
                "Chefe de Divisão",
                "Técnico"
              ]}
            >
              <Layout currentPageName="Usuarios">
                <Usuarios />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Relatórios - Apenas gerencial (exceto Técnico) */}
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Diretor Jurídico",
                "Vice-Diretor Jurídico",
                "Chefe de Divisão"
              ]}
            >
              <Layout currentPageName="Relatorios">
                <Relatorios />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Atividades - Todos os usuários autenticados */}
        <Route
          path="/atividades"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Diretor Jurídico",
                "Vice-Diretor Jurídico",
                "Chefe de Divisão",
                "Técnico"
              ]}
            >
              <Layout currentPageName="Atividades">
                <Atividades />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
