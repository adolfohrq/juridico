# 🏛️ SIGAJ - Sistema de Gestão de Aprovações Jurídicas

Sistema completo com frontend React, backend Node.js/TypeScript, banco PostgreSQL e autenticação JWT + Google OAuth.

## ✅ Status do Projeto

**100% Implementado e Pronto para Deploy!**

- ✅ Frontend React com Tailwind CSS
- ✅ Backend API REST com Express + TypeScript
- ✅ Banco de dados PostgreSQL com Prisma ORM
- ✅ Autenticação JWT + Google OAuth
- ✅ Sistema de permissões por cargo (RBAC)
- ✅ CRUD completo de Pedidos, Usuários e Atividades
- ✅ Integração frontend-backend funcional
- ✅ Guia de deploy gratuito (Supabase + Render + Vercel)

---

## 📁 Estrutura do Projeto

```
juri/
├── backend/                     # Backend API (Node.js + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco de dados
│   │   └── seed.ts             # Dados iniciais
│   ├── src/
│   │   ├── config/             # Configurações (DB, Passport)
│   │   ├── controllers/        # Controllers das rotas
│   │   ├── services/           # Lógica de negócio
│   │   ├── middlewares/        # Auth, Erros, etc
│   │   ├── routes/             # Definição de rotas
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilitários
│   │   └── server.ts           # Arquivo principal
│   ├── .env.example            # Exemplo de variáveis de ambiente
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md               # Documentação específica do backend
│
├── src/                         # Frontend React
│   ├── components/             # Componentes React
│   │   ├── ui/                # Componentes UI reutilizáveis
│   │   └── dashboard/         # Componentes do dashboard
│   ├── entities/              # Classes para API (User, Pedido, etc)
│   ├── services/              # Serviço HTTP (axios)
│   ├── pages/                 # Páginas da aplicação
│   ├── utils/                 # Funções utilitárias
│   ├── App.jsx                # Rotas principais
│   └── main.jsx               # Entry point
│
├── public/                     # Arquivos estáticos
├── .env.example               # Exemplo de env do frontend
├── GUIA_DEPLOY.md             # 📘 Guia completo de deploy
├── CONTROLE_DE_ACESSO.md      # Documentação de permissões
├── README.md                  # README original
└── README_COMPLETO.md         # Este arquivo
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (grátis)
- Conta no Google Cloud Console (opcional, para OAuth)

### 1. Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configurar Backend

#### Criar Banco de Dados no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a **Connection String** (Database URL)

#### Configurar Variáveis de Ambiente

```bash
cd backend
cp .env.example .env
```

Edite o `.env` e preencha:

```env
DATABASE_URL="postgresql://postgres:SUA-SENHA@xxx.supabase.co:5432/postgres"
JWT_SECRET="seu-secret-muito-seguro"
JWT_REFRESH_SECRET="outro-secret-diferente"
GOOGLE_CLIENT_ID="seu-google-client-id" # opcional
GOOGLE_CLIENT_SECRET="seu-google-secret" # opcional
```

#### Executar Migrations e Seeds

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

#### Iniciar Backend

```bash
npm run dev
```

Backend rodando em: `http://localhost:3000`

### 3. Configurar Frontend

```bash
# Na raiz do projeto
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_AUTH_URL=http://localhost:3000/api/auth/google
```

#### Iniciar Frontend

```bash
npm run dev
```

Frontend rodando em: `http://localhost:3005`

### 4. Acessar o Sistema

Abra [http://localhost:3005](http://localhost:3005) e faça login com:

- **Email**: `diretor@sigaj.com`
- **Senha**: `senha123`

Outros usuários de teste estão no [backend/README.md](backend/README.md)

---

## 🎯 Funcionalidades Principais

### Autenticação e Segurança

- ✅ Login com email/senha (JWT)
- ✅ Login com Google OAuth 2.0
- ✅ Refresh tokens automáticos
- ✅ Proteção de rotas por permissão
- ✅ Sistema RBAC (4 níveis de cargo)

### Cargos e Permissões

| Cargo | Permissões |
|-------|-----------|
| **Diretor Jurídico** | Acesso total, criar pareceres, aprovar, gerenciar usuários |
| **Vice-Diretor Jurídico** | Similar ao Diretor, criar pareceres, aprovar |
| **Chefe de Divisão** | Gerenciar equipe, visualizar pedidos do setor |
| **Técnico** | Executar tarefas atribuídas, visualizar apenas seus pedidos |

### Módulos do Sistema

#### 📊 Dashboard
- Cards de estatísticas (Total, Pendentes, Em Execução, Concluídos)
- Gráfico de distribuição por status
- Atividades recentes
- Tarefas urgentes

#### 📋 Pedidos/Pareceres
- Listar todos os pedidos (com filtros de acesso por cargo)
- Criar novos pedidos
- Atribuir responsáveis
- Adicionar comentários
- Upload de documentos
- Alterar status e prioridade
- Histórico completo de ações

#### 👥 Usuários
- Listar usuários do sistema
- Criar, editar e excluir usuários (apenas admin)
- Gerenciar cargos e permissões
- Ativar/desativar usuários

#### 📈 Relatórios
- Estatísticas por período
- Visualizações gráficas
- Filtros avançados

#### 📜 Atividades
- Log completo de todas as ações
- Timeline de eventos
- Filtros por pedido ou usuário
- Auditoria automática

---

## 🔌 APIs Disponíveis

### Autenticação

```
POST   /api/auth/register          - Registrar novo usuário
POST   /api/auth/login             - Login
POST   /api/auth/refresh           - Renovar token
POST   /api/auth/logout            - Logout
GET    /api/auth/me                - Dados do usuário autenticado
GET    /api/auth/google            - Login com Google
```

### Pedidos

```
GET    /api/pedidos                - Listar pedidos
POST   /api/pedidos                - Criar pedido
GET    /api/pedidos/:id            - Detalhes de um pedido
PUT    /api/pedidos/:id            - Atualizar pedido
DELETE /api/pedidos/:id            - Deletar pedido
GET    /api/pedidos/statistics     - Estatísticas
POST   /api/pedidos/:id/comentarios - Adicionar comentário
```

### Usuários

```
GET    /api/users                  - Listar usuários
POST   /api/users                  - Criar usuário
GET    /api/users/:id              - Detalhes de um usuário
PUT    /api/users/:id              - Atualizar usuário
DELETE /api/users/:id              - Deletar usuário
POST   /api/users/change-password  - Alterar senha
```

### Atividades

```
GET    /api/atividades             - Listar logs
GET    /api/atividades/recent      - Atividades recentes
```

Documentação completa: [backend/README.md](backend/README.md)

---

## 🌐 Deploy para Produção

### Opção 1: Deploy Gratuito (Recomendado)

Siga o [**GUIA_DEPLOY.md**](GUIA_DEPLOY.md) para fazer deploy usando:

- **Banco**: Supabase (PostgreSQL grátis)
- **Backend**: Render.com (750h/mês grátis)
- **Frontend**: Vercel (ilimitado grátis)

**Custo total: R$ 0,00/mês** 🎉

### Opção 2: Deploy em Servidor Próprio

1. Configure um servidor VPS (DigitalOcean, AWS, etc.)
2. Instale Node.js, PostgreSQL e Nginx
3. Configure PM2 para o backend
4. Build do frontend e sirva via Nginx
5. Configure SSL com Let's Encrypt

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.3** - Framework UI
- **Vite 5.4** - Build tool
- **React Router 6** - Roteamento
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **Date-fns** - Datas
- **Framer Motion** - Animações

### Backend
- **Node.js** + **TypeScript** - Runtime
- **Express 5** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Passport.js** - OAuth
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança
- **CORS** - Cross-origin

---

## 📚 Documentação Adicional

- [**GUIA_DEPLOY.md**](GUIA_DEPLOY.md) - Guia completo de deploy gratuito
- [**backend/README.md**](backend/README.md) - Documentação do backend
- [**CONTROLE_DE_ACESSO.md**](CONTROLE_DE_ACESSO.md) - Sistema de permissões

---

## 🔐 Segurança

### Implementado

- ✅ Senhas hasheadas com bcrypt (salt 10)
- ✅ JWT para autenticação stateless
- ✅ Refresh tokens para renovação automática
- ✅ Helmet para headers de segurança
- ✅ CORS configurável
- ✅ Validação de permissões no backend
- ✅ Logs de auditoria automáticos
- ✅ Sanitização de inputs

### Para Produção

- [ ] Trocar todos os secrets
- [ ] Configurar HTTPS
- [ ] Rate limiting
- [ ] Backups automáticos
- [ ] Monitoramento de erros (Sentry)
- [ ] Alertas de segurança

---

## 🧪 Testando a API

### Com curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diretor@sigaj.com","password":"senha123"}'

# Listar pedidos (com token)
curl http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Com Postman/Insomnia

Importe a collection com todas as rotas:

1. Configure a variável `{{baseUrl}}` = `http://localhost:3000/api`
2. Faça login em `/auth/login`
3. Copie o `accessToken` retornado
4. Use em outras requisições no header `Authorization: Bearer TOKEN`

---

## 🐛 Troubleshooting

### Backend não conecta ao banco

**Erro**: "Can't reach database server"

**Solução**:
- Verifique se `DATABASE_URL` está correto no `.env`
- Teste a conexão no Supabase Dashboard
- Caracteres especiais na senha precisam de URL encoding

### CORS Error

**Erro**: "blocked by CORS policy"

**Solução**:
- Verifique `FRONTEND_URL` no backend `.env`
- Deve ser a URL exata do frontend (com protocolo)
- Reinicie o backend após alterar

### 401 Unauthorized

**Erro**: "Token inválido"

**Solução**:
- Limpe o localStorage do navegador (F12 → Application → Local Storage)
- Faça logout e login novamente
- Verifique se `JWT_SECRET` está definido no backend

### Prisma Errors

**Erro**: "Schema not found"

**Solução**:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

---

## 📞 Suporte e Contato

### Logs de Debug

- **Backend**: Console do terminal onde rodou `npm run dev`
- **Frontend**: Console do navegador (F12)
- **Banco**: Supabase Dashboard → SQL Editor

### Ferramentas Úteis

- **Prisma Studio**: `npm run prisma:studio` - Interface visual do banco
- **Thunder Client/Postman**: Testar APIs
- **React DevTools**: Debug de componentes

---

## 📄 Licença

Este projeto foi criado para fins educacionais e de demonstração.

---

## 🤝 Contribuindo

Para melhorias ou correções:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## ✨ Próximos Passos

Sugestões para expandir o projeto:

- [ ] Notificações em tempo real (WebSockets)
- [ ] Upload de arquivos para Supabase Storage
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Dashboard com mais gráficos interativos
- [ ] App mobile (React Native)
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD com GitHub Actions
- [ ] Multi-tenancy (múltiplas organizações)

---

**Desenvolvido com ❤️ usando Claude Code**

Sistema completo e pronto para uso!

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    SIGAJ - Arquitetura                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (React + Vite)                                    │
│  ↓ HTTP/REST + JWT                                          │
│  Backend (Express + TypeScript)                             │
│  ↓ Prisma ORM                                               │
│  Database (PostgreSQL - Supabase)                           │
│                                                             │
│  Autenticação:                                              │
│  - JWT (email/senha)                                        │
│  - Google OAuth 2.0                                         │
│                                                             │
│  Deploy:                                                    │
│  - Frontend: Vercel (grátis)                                │
│  - Backend: Render.com (grátis)                             │
│  - Database: Supabase (grátis)                              │
│                                                             │
│  Total: R$ 0,00/mês 🎉                                      │
└─────────────────────────────────────────────────────────────┘
```

---

**🎯 Tudo pronto! Siga o GUIA_DEPLOY.md para colocar online!**
