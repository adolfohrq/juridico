# 🚀 Guia Completo de Deploy - SIGAJ

Guia passo a passo para colocar o sistema SIGAJ online usando ferramentas **100% gratuitas**.

## 📋 Stack de Deploy

- **Banco de Dados**: Supabase (PostgreSQL) - Grátis
- **Backend API**: Render.com - Grátis (750h/mês)
- **Frontend**: Vercel - Grátis (Unlimited)
- **Google OAuth**: Google Cloud Console - Grátis

---

## 1️⃣ Configurar Banco de Dados (Supabase)

### Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Preencha:
   - **Name**: sigaj-database
   - **Database Password**: Crie uma senha forte e anote YoKDf7BRNkHWAuS6
   - **Region**: South America (São Paulo) ou mais próxima
4. Clique em **Create new project** e aguarde alguns minutos

### Obter Credenciais do Banco

1. No projeto criado, vá em **Settings** → **Database**
2. Procure por **Connection String** → **URI**
3. Copie a Connection String (será algo assim):

```
postgresql://postgres.[PROJETO]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

4. Substitua `[SENHA]` pela senha que você criou
5. **Salve essa string**, você vai precisar dela!

### Opcional: Obter Credenciais do Storage

Se for usar upload de arquivos:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public** key

---

## 2️⃣ Configurar Google OAuth (Opcional)

### Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto chamado "SIGAJ"
3. No menu, vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Se solicitado, configure a **OAuth consent screen**:
   - **User Type**: External
   - **App name**: SIGAJ
   - **User support email**: seu email
   - **Developer contact**: seu email
6. Clique em **Save and Continue** até finalizar

### Criar OAuth Client ID

1. Volte em **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Configure:
   - **Application type**: Web application
   - **Name**: SIGAJ Web Client
   - **Authorized redirect URIs**: (adicione ambas)
     - `http://localhost:3000/api/auth/google/callback` (desenvolvimento)
     - `https://SEU-APP.onrender.com/api/auth/google/callback` (produção - adicionar depois)
3. Clique em **Create**
4. **Anote**:
   - **Client ID**
   - **Client Secret**

---

## 3️⃣ Deploy do Backend (Render.com)

### Preparar Código para Deploy

1. Certifique-se que o código está em um repositório Git (GitHub, GitLab, etc.)
2. Faça commit de todas as alterações:

```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### Criar Conta e Deploy no Render

1. Acesse [https://render.com](https://render.com) e crie uma conta (use GitHub)
2. No dashboard, clique em **New** → **Web Service**
3. Conecte seu repositório Git
4. Configure o serviço:

**Basic Settings:**
- **Name**: `sigaj-backend`
- **Region**: Oregon (US West) - é grátis
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**:
  ```
  npm install && npm run prisma:generate && npm run build
  ```
- **Start Command**:
  ```
  npm start
  ```

**Environment Variables** (clique em "Advanced"):

Adicione cada uma dessas variáveis:

```env
DATABASE_URL=sua-connection-string-do-supabase
JWT_SECRET=gere-um-secret-forte-aqui-use-senha-longa
JWT_REFRESH_SECRET=outro-secret-diferente-para-refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=seu-client-id-do-google
GOOGLE_CLIENT_SECRET=seu-client-secret-do-google
GOOGLE_CALLBACK_URL=https://sigaj-backend.onrender.com/api/auth/google/callback
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://SEU-APP-FRONTEND.vercel.app
```

> **Importante**: Substitua `SEU-APP-FRONTEND` pela URL real do Vercel (você vai obter no próximo passo)

5. Clique em **Create Web Service**
6. Aguarde o build (leva de 5-10 minutos)

### Executar Migrations no Render

1. Quando o deploy terminar, vá na aba **Shell** do seu serviço
2. Execute os seguintes comandos:

```bash
# Executar migrations
npx prisma migrate deploy

# Popular com dados iniciais
npx ts-node prisma/seed.ts
```

3. Anote a URL do seu backend, será algo como:
   ```
   https://sigaj-backend.onrender.com
   ```

---

## 4️⃣ Deploy do Frontend (Vercel)

### Preparar Frontend

1. Crie o arquivo `.env.production` na raiz do projeto (não no backend):

```env
VITE_API_BASE_URL=https://sigaj-backend.onrender.com/api
VITE_GOOGLE_AUTH_URL=https://sigaj-backend.onrender.com/api/auth/google
```

2. Commit as alterações:

```bash
git add .
git commit -m "Configurar env de produção"
git push origin main
```

### Deploy no Vercel

1. Acesse [https://vercel.com](https://vercel.com) e crie uma conta (use GitHub)
2. Clique em **Add New** → **Project**
3. Importe seu repositório
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Environment Variables:**

Adicione as mesmas variáveis do arquivo `.env.production`:

```env
VITE_API_BASE_URL=https://sigaj-backend.onrender.com/api
VITE_GOOGLE_AUTH_URL=https://sigaj-backend.onrender.com/api/auth/google
```

5. Clique em **Deploy**
6. Aguarde o build (2-3 minutos)

### Obter URL do Frontend

1. Após o deploy, a Vercel vai gerar uma URL automática, tipo:
   ```
   https://sigaj-xxx.vercel.app
   ```
2. **Anote essa URL!**

---

## 5️⃣ Atualizar Configurações

### Atualizar CORS no Backend (Render)

1. Volte no **Render.com** → Seu serviço backend
2. Vá em **Environment** → Edit
3. Atualize a variável:
   ```env
   FRONTEND_URL=https://sigaj-xxx.vercel.app
   ```
   (use a URL real do Vercel)
4. Salve e o serviço vai reiniciar automaticamente

### Atualizar Google OAuth Callback

1. Volte no **Google Cloud Console**
2. Vá em **APIs & Services** → **Credentials**
3. Clique no seu OAuth 2.0 Client ID
4. Em **Authorized redirect URIs**, adicione:
   ```
   https://sigaj-backend.onrender.com/api/auth/google/callback
   ```
5. Salve

---

## 6️⃣ Testar o Sistema

### Acessar o Sistema

1. Abra o navegador e acesse: `https://sigaj-xxx.vercel.app`
2. Use as credenciais de teste:
   - **Email**: `diretor@sigaj.com`
   - **Senha**: `senha123`

### Testar Login com Google

1. Clique em "Login com Google" (se implementado no frontend)
2. Selecione sua conta Google
3. Deve redirecionar e fazer login automaticamente

### Verificar API

1. Teste diretamente a API:
   ```
   https://sigaj-backend.onrender.com/api/health
   ```
2. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-xx-xxTxx:xx:xx.xxxZ"
   }
   ```

---

## 7️⃣ Domínio Personalizado (Opcional)

### Configurar Domínio no Vercel

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `sigaj.seudominio.com`)
3. Configure os registros DNS conforme instruções do Vercel

### Configurar Domínio no Render

1. No Render, vá em **Settings** → **Custom Domain**
2. Adicione o domínio da API (ex: `api.sigaj.seudominio.com`)
3. Configure os registros DNS

### Atualizar Variáveis

- Atualize `FRONTEND_URL` no Render
- Atualize `VITE_API_BASE_URL` no Vercel
- Atualize callback do Google OAuth

---

## 🔧 Troubleshooting

### Backend não inicia no Render

**Erro**: "Application failed to respond"

**Solução**:
- Verifique os logs na aba "Logs" do Render
- Confirme que `DATABASE_URL` está correto
- Teste a conexão no Supabase Dashboard

### CORS Error no Frontend

**Erro**: "Access to fetch has been blocked by CORS policy"

**Solução**:
- Verifique se `FRONTEND_URL` no Render está correto
- Deve ser a URL EXATA do Vercel (com https)
- Reinicie o serviço no Render após alterar

### Google OAuth não funciona

**Erro**: "redirect_uri_mismatch"

**Solução**:
- Verifique as URIs autorizadas no Google Cloud Console
- Deve incluir a URL do Render (com /api/auth/google/callback)
- Aguarde alguns minutos para propagação

### 401 Unauthorized

**Erro**: Token inválido

**Solução**:
- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se `JWT_SECRET` está definido no Render

### Render Free Plan dorming

O plano grátis do Render "dorme" após inatividade. Soluções:

1. **Usar um ping service grátis**:
   - [UptimeRobot](https://uptimerobot.com) - pinga sua API a cada 5 minutos
   - [Cron-job.org](https://cron-job.org)

2. **Avisar usuários**:
   - Primeiro acesso pode levar 30-60 segundos
   - Após isso, fica rápido

---

## 💰 Limites dos Planos Grátis

### Supabase (Grátis)
- ✅ 500MB de armazenamento de banco
- ✅ 1GB de storage de arquivos
- ✅ 2GB de transferência/mês
- ✅ 50,000 requisições/mês

### Render (Grátis)
- ✅ 750 horas/mês (suficiente para 1 mês)
- ✅ 512MB RAM
- ⚠️ "Dorme" após 15 minutos de inatividade
- ⚠️ Pode levar 30s para "acordar"

### Vercel (Grátis)
- ✅ Sites ilimitados
- ✅ 100GB de banda/mês
- ✅ Deployments ilimitados
- ✅ SSL automático

---

## 🔐 Checklist de Segurança

Antes de usar em produção:

- [ ] Trocar todos os secrets (`JWT_SECRET`, etc.)
- [ ] Usar senhas fortes no banco de dados
- [ ] Configurar rate limiting (adicionar ao backend)
- [ ] Configurar backups automáticos no Supabase
- [ ] Adicionar monitoramento de erros (Sentry)
- [ ] Revisar permissões de usuários
- [ ] Testar todos os fluxos principais
- [ ] Configurar alertas de downtime

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs:
   - **Render**: Aba "Logs"
   - **Vercel**: Aba "Functions" → Logs
   - **Browser**: Console (F12)

2. Teste a conexão:
   - API Health: `https://seu-backend.onrender.com/api/health`
   - Database: Supabase Dashboard → SQL Editor

3. Docum entação oficial:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**✨ Parabéns! Seu sistema SIGAJ está online e acessível para o mundo todo!**

URLs Finais:
- 🌐 Frontend: `https://sigaj-xxx.vercel.app`
- 🔧 Backend API: `https://sigaj-backend.onrender.com`
- 💾 Banco de Dados: Supabase Cloud

**Total de custo: R$ 0,00/mês** 🎉
