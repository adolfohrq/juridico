# 🎯 Configuração de Deploy - SIGAJ

## ✅ URLs Configuradas

- **Backend (Render)**: https://juridico.onrender.com
- **Frontend (Vercel)**: https://juridico-seven.vercel.app

---

## 📝 Checklist de Configuração

### ✅ 1. Backend no Render

Acesse: https://dashboard.render.com/web/juridico

#### Variáveis de Ambiente Necessárias:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:SUA-SENHA@xxx.supabase.co:5432/postgres

# JWT Secrets (gere senhas fortes!)
JWT_SECRET=sua-chave-super-secreta-mude-isso
JWT_REFRESH_SECRET=outra-chave-diferente-para-refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (opcional - se não usar, deixe em branco)
GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=https://juridico.onrender.com/api/auth/google/callback

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://juridico-seven.vercel.app
```

#### Como configurar:

1. No Render, vá em **Environment** no menu lateral
2. Clique em **Add Environment Variable** para cada uma
3. Copie e cole os valores acima
4. **IMPORTANTE**: Substitua os valores de exemplo pelos reais:
   - `DATABASE_URL`: Pegue no Supabase
   - `JWT_SECRET`: Use uma senha longa e aleatória
   - `JWT_REFRESH_SECRET`: Outra senha diferente
   - `GOOGLE_*`: Pegue no Google Cloud Console (se for usar)

5. Clique em **Save Changes**
6. O backend vai reiniciar automaticamente

#### Executar Migrations:

Após o deploy, vá em **Shell** no Render e execute:

```bash
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

### ✅ 2. Frontend no Vercel

Acesse: https://vercel.com/seu-usuario/juridico

#### Variáveis de Ambiente Necessárias:

```env
VITE_API_BASE_URL=https://juridico.onrender.com/api
VITE_GOOGLE_AUTH_URL=https://juridico.onrender.com/api/auth/google
```

#### Como configurar:

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione cada variável:

**Variável 1:**
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://juridico.onrender.com/api`
- **Environments**: ✅ Production ✅ Preview ✅ Development

**Variável 2:**
- **Key**: `VITE_GOOGLE_AUTH_URL`
- **Value**: `https://juridico.onrender.com/api/auth/google`
- **Environments**: ✅ Production ✅ Preview ✅ Development

3. Clique em **Save**
4. Vá em **Deployments** → último deploy → **⋯** → **Redeploy**
5. Marque **Use existing Build Cache** ❌ (desmarcar para usar novas variáveis)
6. Clique em **Redeploy**

---

## 🔐 Obter Credenciais

### Supabase (Banco de Dados)

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto (se ainda não criou)
3. Vá em **Settings** → **Database**
4. Copie a **Connection String (URI mode)**
5. Substitua `[YOUR-PASSWORD]` pela senha do projeto

Exemplo:
```
postgresql://postgres.xxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### Google OAuth (Opcional)

1. Acesse [https://console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto novo ou selecione um existente
3. Vá em **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth Consent Screen se solicitado
6. Em **Application type**: Web application
7. Em **Authorized redirect URIs**, adicione:
   ```
   https://juridico.onrender.com/api/auth/google/callback
   ```
8. Clique em **Create**
9. Copie o **Client ID** e **Client Secret**

---

## 🧪 Testar Configuração

### 1. Testar Backend

Abra no navegador:
```
https://juridico.onrender.com/api/health
```

**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T..."
}
```

Se der erro 503 ou timeout:
- Aguarde 30-60 segundos (backend pode estar "acordando")
- Tente novamente

### 2. Testar Frontend

Abra no navegador:
```
https://juridico-seven.vercel.app
```

**Esperado:**
- Página de login aparece
- Sem erros no console (F12)

### 3. Testar Login

Use as credenciais de teste (após executar seed no backend):

```
Email: diretor@sigaj.com
Senha: senha123
```

Outros usuários:
- `vice@sigaj.com` / `senha123`
- `chefe@sigaj.com` / `senha123`
- `tecnico1@sigaj.com` / `senha123`

---

## 🐛 Troubleshooting

### ❌ CORS Error no Frontend

**Erro:** "Access to fetch has been blocked by CORS policy"

**Causa:** Backend não reconhece o frontend

**Solução:**
1. No Render, verifique se `FRONTEND_URL` está correto:
   ```
   FRONTEND_URL=https://juridico-seven.vercel.app
   ```
2. **SEM barra no final!**
3. Salve e aguarde reiniciar (~2 min)

---

### ❌ 401 Unauthorized

**Erro:** "Token inválido" ou não consegue fazer login

**Causa:** Variáveis de ambiente incorretas

**Solução:**
1. No Vercel, verifique se `VITE_API_BASE_URL` tem `/api` no final:
   ```
   https://juridico.onrender.com/api
   ```
2. Redeploy no Vercel (sem cache)
3. Limpe o localStorage do navegador (F12 → Application → Local Storage → Clear)

---

### ❌ Backend não responde

**Erro:** Timeout ou 503 Service Unavailable

**Causa:** Plano grátis do Render "dorme" após 15 min

**Solução:**
1. É normal no primeiro acesso
2. Aguarde 30-60 segundos
3. Recarregue a página
4. Para evitar: use [UptimeRobot](https://uptimerobot.com) para fazer ping a cada 5 minutos

---

### ❌ Cannot connect to database

**Erro:** "Can't reach database server"

**Causa:** `DATABASE_URL` incorreta

**Solução:**
1. No Supabase, vá em Settings → Database
2. Copie novamente a Connection String
3. Certifique-se de substituir `[YOUR-PASSWORD]` pela senha real
4. Se a senha tem caracteres especiais, use URL encoding:
   - `@` → `%40`
   - `#` → `%23`
   - `!` → `%21`
5. Atualize no Render e salve

---

### ❌ Prisma migrations não funcionam

**Erro:** "Schema not found" ou "Cannot find module @prisma/client"

**Solução:**

No Shell do Render, execute em ordem:

```bash
# 1. Gerar cliente Prisma
npx prisma generate

# 2. Executar migrations
npx prisma migrate deploy

# 3. Popular dados de teste
npx ts-node prisma/seed.ts

# 4. Verificar se funcionou
npx prisma studio
```

---

## ✅ Checklist Final

Antes de anunciar o sistema:

- [ ] Backend responde em `/api/health`
- [ ] Frontend carrega sem erros (F12 Console)
- [ ] Login com email/senha funciona
- [ ] Dashboard mostra dados (após seed)
- [ ] Pode listar pedidos
- [ ] Pode criar novo pedido
- [ ] Logout funciona
- [ ] Google OAuth funciona (se configurado)
- [ ] Testado em diferentes navegadores
- [ ] Testado em mobile (responsivo)
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente corretas em ambos

---

## 🔄 Atualizar Código

Quando fizer alterações no código:

```bash
# Fazer alterações...
git add .
git commit -m "Descrição das mudanças"
git push origin main

# Deploy automático em:
# - Vercel: ~2-3 minutos
# - Render: ~5-8 minutos
```

---

## 📞 Suporte Rápido

### Logs de Erro

**Backend (Render):**
1. Acesse https://dashboard.render.com
2. Clique no serviço `juridico`
3. Vá em **Logs** no menu lateral
4. Veja erros em tempo real

**Frontend (Vercel):**
1. Acesse https://vercel.com/dashboard
2. Clique no projeto `juridico`
3. Vá em **Functions** → Logs
4. Ou use o Console do navegador (F12)

**Banco (Supabase):**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute queries para verificar dados

### Testar API Diretamente

Use o curl ou Postman:

```bash
# Health check
curl https://juridico.onrender.com/api/health

# Login
curl -X POST https://juridico.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diretor@sigaj.com","password":"senha123"}'

# Listar pedidos (use o token retornado acima)
curl https://juridico.onrender.com/api/pedidos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🎉 Sistema Configurado!

**URLs Finais:**
- 🌐 Frontend: https://juridico-seven.vercel.app
- 🔧 Backend: https://juridico.onrender.com
- 💾 Banco: Supabase Cloud

**Custo: R$ 0,00/mês** 🚀

---

**Desenvolvido com ❤️ usando Claude Code**
