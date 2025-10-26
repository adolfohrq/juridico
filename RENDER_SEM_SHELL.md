# 🆓 Deploy no Render SEM Shell (Plano Gratuito)

## ⚠️ Importante: Shell Não Está Mais Disponível no Plano Gratuito

O Render removeu o acesso ao Shell no plano gratuito. Mas não se preocupe! **Configuramos o sistema para funcionar automaticamente** sem precisar do Shell!

---

## ✅ O Que Foi Configurado Automaticamente:

### 1. **Migrations Automáticas**
- ✅ Executam automaticamente no startup
- ✅ Criam todas as tabelas no banco
- ✅ Sem necessidade de comandos manuais

### 2. **Seed Automático**
- ✅ Popula o banco com dados iniciais
- ✅ Só executa se o banco estiver vazio
- ✅ Cria 5 usuários de teste
- ✅ Cria 4 pedidos de exemplo

### 3. **Prisma Generate Automático**
- ✅ Roda automaticamente após `npm install`
- ✅ Gera o client do Prisma

---

## 🚀 Como Fazer Deploy no Render (Plano Gratuito):

### Passo 1: Configurar no Render

1. Acesse: https://dashboard.render.com
2. Clique em **New** → **Web Service**
3. Conecte o repositório: `adolfohrq/juridico`
4. Configure:

**Nome**: `juridico`

**Branch**: `main`

**Root Directory**: `backend`

**Runtime**: `Node`

**Build Command**:
```bash
npm install && npm run build
```

**Start Command**:
```bash
npm start
```

**Instance Type**: `Free`

---

### Passo 2: Adicionar Variáveis de Ambiente

Clique em **Advanced** → **Add Environment Variable**

**Adicione as 11 variáveis** (veja arquivo `CONFIGURACAO_RENDER_LOCAL.txt`):

```
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
JWT_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
NODE_ENV=production
PORT=3000
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
```

---

### Passo 3: Deploy!

1. Clique em **Create Web Service**
2. Aguarde o build (~5-8 minutos)
3. Quando aparecer "Live" ✅, está pronto!

---

## 🎯 O Que Acontece Automaticamente:

```
1. npm install
   ↓
2. prisma generate (automático via postinstall)
   ↓
3. npm run build (compila TypeScript)
   ↓
4. npm start
   ↓
5. prisma migrate deploy (cria tabelas)
   ↓
6. node dist/server.js (inicia servidor)
   ↓
7. Verifica se banco está vazio
   ↓
8. Se vazio: executa seed automaticamente
   ↓
9. ✅ Sistema pronto com dados de teste!
```

---

## 🧪 Testar se Funcionou:

### 1. Backend Health Check

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

### 2. Verificar Logs no Render

1. Dashboard → juridico → **Logs**
2. Procure por:
   ```
   ✅ Seed executado com sucesso!
   ```
   ou
   ```
   ✅ Banco já possui dados (5 usuários)
   ```

---

## 🔍 Se o Seed Não Executar Automaticamente:

### Opção 1: Forçar Redeploy

1. No Render, vá em **Manual Deploy**
2. Clique em **Clear build cache & deploy**
3. Aguarde novo deploy

### Opção 2: Criar Endpoint de Seed (TEMPORÁRIO)

Adicione uma rota temporária para executar o seed:

1. Acesse o backend e adicione em `src/routes/index.ts`:

```typescript
// ROTA TEMPORÁRIA - REMOVER DEPOIS!
router.get('/seed-manual', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    await execAsync('npx ts-node prisma/seed.ts');
    res.json({ message: 'Seed executado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao executar seed' });
  }
});
```

2. Faça commit e push
3. Aguarde deploy
4. Acesse: `https://juridico.onrender.com/api/seed-manual`
5. **REMOVA essa rota depois!**

---

## 🐛 Troubleshooting:

### Erro: "Cannot find module 'ts-node'"

**Solução:** Adicionar `ts-node` nas dependencies (não devDependencies)

```bash
cd backend
npm install ts-node --save
git add package.json package-lock.json
git commit -m "Adicionar ts-node como dependência"
git push origin main
```

### Erro: "prisma migrate deploy failed"

**Causa:** DATABASE_URL incorreta ou banco inacessível

**Solução:**
1. Verifique `DATABASE_URL` no Render
2. Teste conexão no Supabase Dashboard
3. Verifique se senha tem caracteres especiais (usar URL encoding)

### Seed não executou

**Verificar nos Logs:**
1. Render → Logs
2. Procure por mensagens de seed
3. Se não aparecer, pode não ter entrado na condição

**Forçar seed:**
- Use Opção 2 acima (endpoint temporário)
- Ou espere próximo deploy

---

## ✅ Vantagens desta Abordagem:

- ✅ **Totalmente automático**
- ✅ **Funciona no plano gratuito**
- ✅ **Sem necessidade de SSH/Shell**
- ✅ **Seed só executa se necessário**
- ✅ **Migrations sempre atualizadas**
- ✅ **Zero configuração manual**

---

## 📝 Comandos Configurados:

No `package.json`:

```json
{
  "scripts": {
    "start": "npm run migrate:deploy && node dist/server.js",
    "migrate:deploy": "prisma migrate deploy",
    "postinstall": "prisma generate"
  }
}
```

No `server.ts`:

```typescript
// Executa seed automaticamente se banco estiver vazio
if (process.env.NODE_ENV === 'production') {
  await runSeedIfNeeded();
}
```

---

## 🎉 Resultado Final:

Após o deploy no Render (plano gratuito):

- ✅ Tabelas criadas automaticamente
- ✅ 5 usuários de teste no banco
- ✅ 4 pedidos de exemplo
- ✅ Sistema 100% funcional
- ✅ **Custo: R$ 0,00/mês**

---

**Login de Teste:**
```
Email: diretor@sigaj.com
Senha: senha123
```

---

**Desenvolvido com ❤️ para funcionar no plano gratuito!**
