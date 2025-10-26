# ⚡ Teste Rápido - SIGAJ

## 🎯 Links Diretos

- **Frontend**: https://juridico-seven.vercel.app
- **Backend Health**: https://juridico.onrender.com/api/health
- **GitHub**: https://github.com/adolfohrq/juridico

---

## ✅ Checklist de Teste

### 1. Backend (Render)

```bash
# Teste no navegador ou curl:
https://juridico.onrender.com/api/health
```

**✅ Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T..."
}
```

**❌ Se der erro:**
- Aguarde 30-60 segundos (pode estar "acordando")
- Verifique se configurou todas as variáveis no Render
- Veja os logs: Render → juridico → Logs

---

### 2. Frontend (Vercel)

```bash
# Abra no navegador:
https://juridico-seven.vercel.app
```

**✅ Esperado:**
- Página de login aparece
- Sem erros no console (F12)
- Formulário de login visível

**❌ Se der erro:**
- F12 → Console → Veja o erro
- Se for CORS: Verifique `FRONTEND_URL` no Render
- Se for 404: Verifique `VITE_API_BASE_URL` no Vercel

---

### 3. Login

**Credenciais:**
```
Email: diretor@sigaj.com
Senha: senha123
```

**✅ Esperado:**
- Redireciona para /dashboard
- Dashboard carrega com dados
- Menu lateral aparece

**❌ Se der erro:**
- **401 Unauthorized**: Backend não rodou seed
  - Execute no Shell do Render: `npx ts-node prisma/seed.ts`
- **Cannot fetch**: Backend offline
  - Aguarde 1 minuto e tente novamente
- **CORS Error**: `FRONTEND_URL` incorreta no Render
  - Deve ser: `https://juridico-seven.vercel.app`

---

### 4. Funcionalidades Básicas

Após login, teste:

- [ ] Dashboard carrega estatísticas
- [ ] "Pedidos" no menu mostra lista
- [ ] Pode clicar em um pedido e ver detalhes
- [ ] "Novo Parecer" (se for Diretor/Vice) abre formulário
- [ ] "Usuários" mostra lista de usuários
- [ ] "Atividades" mostra logs
- [ ] Logout funciona

---

## 🐛 Erros Comuns

### CORS Error

**Erro no console:**
```
Access to fetch at 'https://juridico.onrender.com/api/...'
has been blocked by CORS policy
```

**Solução:**
1. Render → Environment
2. Verificar `FRONTEND_URL=https://juridico-seven.vercel.app`
3. SEM barra no final!
4. Save Changes

---

### 401 Unauthorized

**Erro:** "Token inválido" ou não faz login

**Solução:**
1. Limpe cache: F12 → Application → Local Storage → Clear All
2. Verifique se executou seed no backend
3. Tente outro usuário: `vice@sigaj.com` / `senha123`

---

### Cannot connect to backend

**Erro:** Timeout ou 503

**Solução:**
1. É normal no primeiro acesso (free tier)
2. Aguarde 30-60 segundos
3. Recarregue a página
4. Se persistir: veja logs no Render

---

### No data / Listas vazias

**Erro:** Dashboard sem dados, pedidos vazio

**Solução:**
1. Backend não rodou seed
2. No Shell do Render:
   ```bash
   npx ts-node prisma/seed.ts
   ```
3. Recarregue o frontend

---

## 📊 Dados de Teste

Após executar seed, você terá:

**5 Usuários:**
- diretor@sigaj.com - Diretor Jurídico
- vice@sigaj.com - Vice-Diretor
- chefe@sigaj.com - Chefe de Divisão
- tecnico1@sigaj.com - Técnico
- tecnico2@sigaj.com - Técnico

**Senha de todos:** `senha123`

**4 Pedidos:**
- Análise de Contrato (EM_EXECUCAO)
- Parecer sobre Licitação (PENDENTE, URGENTE)
- Revisão de Edital (AGUARDANDO_APROVACAO)
- Análise de Recurso (CONCLUIDO)

---

## 🔧 Comandos Úteis

### Testar API com curl

```bash
# Health check
curl https://juridico.onrender.com/api/health

# Login
curl -X POST https://juridico.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diretor@sigaj.com","password":"senha123"}'

# Copie o accessToken retornado e use:
curl https://juridico.onrender.com/api/pedidos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📱 Teste em Dispositivos

- [ ] Desktop (Chrome, Firefox, Edge)
- [ ] Mobile (Chrome mobile)
- [ ] Tablet
- [ ] Diferentes resoluções

---

## ✅ Sistema OK quando:

- ✅ Backend responde em /api/health
- ✅ Frontend carrega sem erros
- ✅ Login funciona
- ✅ Dashboard mostra dados
- ✅ Pode navegar entre páginas
- ✅ Pode criar/editar pedidos (se tiver permissão)
- ✅ Logout funciona
- ✅ Sem erros no console (F12)

---

## 🎉 Tudo funcionando?

Parabéns! Seu sistema SIGAJ está no ar! 🚀

**Próximos passos:**
1. Compartilhe a URL: https://juridico-seven.vercel.app
2. Crie novos usuários reais
3. Comece a usar!

---

**Arquivos de Configuração:**
- [CONFIGURACAO_RENDER.txt](CONFIGURACAO_RENDER.txt) - Config backend
- [CONFIGURACAO_VERCEL.txt](CONFIGURACAO_VERCEL.txt) - Config frontend
- [CONFIGURACAO_DEPLOY.md](CONFIGURACAO_DEPLOY.md) - Guia completo

---

**Custo: R$ 0,00/mês** 💰
