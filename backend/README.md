# SIGAJ Backend API

Backend da API REST para o Sistema de Gestão de Aprovações Jurídicas.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação
- **Passport.js** - OAuth (Google)
- **bcrypt** - Hash de senhas

## Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados (Supabase)

#### Criar Projeto no Supabase (Grátis)

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote as credenciais:
   - **Database URL** (Connection String)
   - **API URL**
   - **anon key**

#### Obter Connection String

1. No Supabase, vá em **Settings** → **Database**
2. Copie a **Connection String** (URI mode)
3. Substitua `[YOUR-PASSWORD]` pela senha do banco

Exemplo:
```
postgresql://postgres:[SUA-SENHA]@db.xxx.supabase.co:5432/postgres
```

### 3. Configurar Google OAuth (Opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a **Google+ API**
4. Vá em **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/google/callback`
6. Anote:
   - **Client ID**
   - **Client Secret**

### 4. Criar Arquivo `.env`

Copie o `.env.example` e preencha:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# Database (cole sua connection string do Supabase)
DATABASE_URL="postgresql://postgres:SUA-SENHA@db.xxx.supabase.co:5432/postgres"

# JWT (gere chaves seguras em produção)
JWT_SECRET="seu-secret-muito-seguro-aqui-mude-em-producao"
JWT_REFRESH_SECRET="outro-secret-diferente-para-refresh"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Google OAuth (cole as credenciais do Google Cloud)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Server
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3005"
```

### 5. Executar Migrations do Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar tabelas no banco
npm run prisma:migrate

# (Opcional) Popular com dados de teste
npm run prisma:seed
```

### 6. Iniciar Servidor

```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Rotas da API

### Autenticação

```
POST   /api/auth/register          - Registrar novo usuário
POST   /api/auth/login             - Login com email/senha
POST   /api/auth/refresh           - Renovar access token
POST   /api/auth/logout            - Logout
GET    /api/auth/me                - Dados do usuário autenticado
GET    /api/auth/google            - Iniciar login com Google
GET    /api/auth/google/callback   - Callback do Google OAuth
```

### Pedidos

```
GET    /api/pedidos                - Listar pedidos (filtros: status, prioridade)
POST   /api/pedidos                - Criar novo pedido
GET    /api/pedidos/:id            - Detalhes de um pedido
PUT    /api/pedidos/:id            - Atualizar pedido
DELETE /api/pedidos/:id            - Deletar pedido
GET    /api/pedidos/statistics     - Estatísticas dos pedidos
POST   /api/pedidos/:id/comentarios - Adicionar comentário
```

### Usuários

```
GET    /api/users                  - Listar usuários
GET    /api/users/:id              - Detalhes de um usuário
POST   /api/users                  - Criar usuário (admin)
PUT    /api/users/:id              - Atualizar usuário (admin)
DELETE /api/users/:id              - Deletar usuário (admin)
POST   /api/users/change-password  - Alterar própria senha
```

### Atividades

```
GET    /api/atividades             - Listar logs (filtros: pedidoId, userId)
GET    /api/atividades/recent      - Atividades recentes
```

### Health Check

```
GET    /api/health                 - Status da API
```

## Autenticação

A API usa **JWT (JSON Web Tokens)**. Para acessar rotas protegidas:

1. Faça login em `/api/auth/login`
2. Receba o `accessToken` e `refreshToken`
3. Inclua o token no header das requisições:

```
Authorization: Bearer SEU_ACCESS_TOKEN
```

### Exemplo com curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diretor@sigaj.com","password":"senha123"}'

# Usar token
curl http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Dados de Teste

Após executar `npm run prisma:seed`, você terá:

### Usuários

| Email | Senha | Cargo |
|-------|-------|-------|
| diretor@sigaj.com | senha123 | Diretor Jurídico |
| vice@sigaj.com | senha123 | Vice-Diretor Jurídico |
| chefe@sigaj.com | senha123 | Chefe de Divisão |
| tecnico1@sigaj.com | senha123 | Técnico |
| tecnico2@sigaj.com | senha123 | Técnico |

### 4 Pedidos de exemplo com diferentes status

## Deploy em Produção (Render.com - Grátis)

### 1. Criar conta no Render

1. Acesse [https://render.com](https://render.com)
2. Crie uma conta (use GitHub)

### 2. Deploy do Backend

1. Faça push do código para GitHub
2. No Render, clique em **New** → **Web Service**
3. Conecte seu repositório
4. Configure:
   - **Name**: sigaj-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
5. Adicione as **Environment Variables** (mesmas do `.env`)
6. Clique em **Create Web Service**

### 3. Executar Migrations no Deploy

Após o primeiro deploy, execute no **Shell** do Render:

```bash
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

### 4. Atualizar CORS

No `.env` de produção, adicione a URL do frontend do Vercel:

```env
FRONTEND_URL="https://seu-app.vercel.app"
```

## Prisma Studio

Para visualizar/editar dados do banco visualmente:

```bash
npm run prisma:studio
```

Abre em `http://localhost:5555`

## Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts             # Dados iniciais
├── src/
│   ├── config/
│   │   ├── database.ts     # Configuração Prisma
│   │   └── passport.ts     # Configuração autenticação
│   ├── controllers/        # Controllers das rotas
│   ├── services/           # Lógica de negócio
│   ├── middlewares/        # Middlewares (auth, erros)
│   ├── routes/             # Definição de rotas
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilitários
│   └── server.ts           # Arquivo principal
├── .env                    # Variáveis de ambiente (não commitar!)
├── .env.example            # Exemplo de .env
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Erro: "Can't reach database server"

- Verifique se o `DATABASE_URL` está correto
- Teste a conexão no Supabase Dashboard
- Verifique se a senha tem caracteres especiais (use URL encoding)

### Erro: "JWT Secret not defined"

- Certifique-se que o arquivo `.env` existe
- Verifique se `JWT_SECRET` está definido no `.env`

### Erro de CORS

- Adicione a URL do frontend em `FRONTEND_URL` no `.env`
- Verifique a configuração de CORS em `server.ts`

### Google OAuth não funciona

- Verifique as credenciais no Google Cloud Console
- Confirme que a Redirect URI está correta
- Em produção, adicione a URL de produção nas URIs autorizadas

## Segurança

### Desenvolvimento

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT para autenticação
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Validação de permissões por cargo

### Produção (Checklist)

- [ ] Trocar todos os secrets no `.env`
- [ ] Configurar HTTPS
- [ ] Limitar rate limiting
- [ ] Habilitar logs de auditoria
- [ ] Backups automáticos do banco
- [ ] Monitoramento de erros (Sentry)

## Suporte

Para dúvidas:
1. Verifique os logs do servidor
2. Consulte a documentação do Prisma
3. Teste rotas com Postman/Insomnia

---

**Desenvolvido com ❤️ usando Claude Code**
