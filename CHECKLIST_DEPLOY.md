# ✅ Checklist Rápido de Deploy

## 🎯 O que você precisa fazer AGORA:

### 1. Backend no Render (Fazer PRIMEIRO!)

```bash
cd backend
```

- [ ] Criar conta no [Supabase](https://supabase.com)
- [ ] Criar projeto no Supabase
- [ ] Copiar Connection String do banco
- [ ] Criar conta no [Render](https://render.com)
- [ ] Fazer push do código para GitHub
- [ ] Criar Web Service no Render
- [ ] Configurar variáveis de ambiente (ver `.env.example` no backend)
- [ ] Aguardar deploy (~5-10 min)
- [ ] No Shell do Render, executar:
  ```bash
  npx prisma migrate deploy
  npx ts-node prisma/seed.ts
  ```
- [ ] Anotar URL do backend: `https://______.onrender.com`

**Guia completo**: [backend/README.md](backend/README.md)

---

### 2. Frontend no Vercel (Fazer DEPOIS do backend!)

#### 2.1. Preparar

- [ ] Abrir `.env.production`
- [ ] Substituir `seu-backend.onrender.com` pela URL real do Render
- [ ] Fazer commit e push para GitHub:
  ```bash
  git add .
  git commit -m "Deploy frontend"
  git push origin main
  ```

#### 2.2. Deploy

- [ ] Criar conta no [Vercel](https://vercel.com) (usar GitHub)
- [ ] New Project → Importar repositório
- [ ] Adicionar Environment Variables:
  - `VITE_API_BASE_URL` = `https://SEU-BACKEND.onrender.com/api`
  - `VITE_GOOGLE_AUTH_URL` = `https://SEU-BACKEND.onrender.com/api/auth/google`
- [ ] Clicar em "Deploy"
- [ ] Aguardar deploy (~2-3 min)
- [ ] Anotar URL: `https://______.vercel.app`

**Guia completo**: [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

---

### 3. Conectar Frontend ↔ Backend

#### No Render (Backend):

- [ ] Ir em Environment
- [ ] Editar variável `FRONTEND_URL`
- [ ] Colocar URL do Vercel: `https://seu-app.vercel.app`
- [ ] Salvar (vai reiniciar automaticamente)

---

### 4. Testar

- [ ] Abrir URL do Vercel no navegador
- [ ] Fazer login: `diretor@sigaj.com` / `senha123`
- [ ] Dashboard carrega?
- [ ] Lista de pedidos aparece?
- [ ] Pode criar novo pedido?
- [ ] Logout funciona?

---

## 🐛 Se der erro:

### CORS Error
→ Verifique `FRONTEND_URL` no Render (deve ser URL exata do Vercel)

### 401 Unauthorized
→ Verifique `VITE_API_BASE_URL` no Vercel (deve ter `/api` no final)

### Cannot connect to backend
→ Aguarde 1-2 minutos (backend pode estar "acordando")

### Build falhou
→ Teste localmente: `npm run build`

---

## 📚 Guias Completos:

1. **Backend**: [backend/README.md](backend/README.md)
2. **Frontend Vercel**: [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)
3. **Geral**: [GUIA_DEPLOY.md](GUIA_DEPLOY.md)

---

## 🎉 Pronto!

Seu sistema estará no ar em ~20-30 minutos total!

**Custo: R$ 0,00/mês** 🚀
