# 🔧 Problemas Comuns e Soluções

## Problema: "localhost se recusou a se conectar" ao abrir localhost:3005

### Causa
O frontend não conseguiu iniciar na porta 3005 porque havia um conflito de portas.

### Solução Aplicada ✅
1. Mudei o Vite para usar porta 3005 (estava conflitando com backend na 3000)
2. Atualizei o script `start-local.bat` para:
   - Matar processos antigos nas portas 3000 e 3005
   - Aguardar 5 segundos para o backend iniciar completamente
   - Depois iniciar o frontend

### Como Rodar Agora

**Opção 1: Script Automático (RECOMENDADO)**
```bash
# Clique duas vezes em:
start-local.bat
```

**Opção 2: Manual (2 terminais)**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Aguarde aparecer: "🚀 Servidor rodando na porta 3000"

# Terminal 2 - Frontend
npm run dev
```

---

## Problema: "Port 3005 is in use, trying another one..."

### Causa
Algum processo ainda está usando a porta 3005.

### Solução 1: Usar o script automático
O script `start-local.bat` agora mata automaticamente processos antigos.

### Solução 2: Matar o processo manualmente
```bash
# No PowerShell ou CMD:
netstat -ano | findstr :3005

# Você verá algo como:
# TCP    [::1]:3005    ...    LISTENING    12345

# Mate o processo (substitua 12345 pelo PID que apareceu):
taskkill /F /PID 12345
```

---

## Problema: Frontend abre mas dá erro ao fazer login

### Verificações:

**1. Backend está rodando?**
```bash
# Abra no navegador:
http://localhost:3000/api/health

# Deve retornar:
{"status":"ok","timestamp":"..."}
```

**2. Arquivo .env.local existe?**
```bash
# Na raiz do projeto, deve existir o arquivo .env.local com:
VITE_API_URL=http://localhost:3000/api
PORT=3005
```

**3. Variáveis de ambiente estão corretas?**
```bash
# Verifique se backend/.env existe e tem:
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
```

---

## Problema: "Cannot connect to database"

### Verificação:
```bash
cd backend
npx prisma db pull
```

### Se der erro:
1. Verifique se o `DATABASE_URL` no `backend/.env` está correto
2. Teste a conexão no Supabase Dashboard
3. Veja se não há firewall bloqueando

---

## Problema: Login retorna "User not found"

### Causa
Banco de dados não tem usuários (seed não foi executado).

### Solução:
```bash
cd backend
npx ts-node prisma/seed.ts
```

Isso vai criar 5 usuários de teste:
- `diretor@sigaj.com`
- `vice@sigaj.com`
- `chefe@sigaj.com`
- `tecnico1@sigaj.com`
- `tecnico2@sigaj.com`

Todos com senha: `senha123`

---

## Problema: Backend inicia mas fecha imediatamente

### Possíveis causas:

**1. Erro no TypeScript**
```bash
cd backend
npm run build

# Se der erro, verifique o código TypeScript
```

**2. Variáveis de ambiente faltando**
Verifique se `backend/.env` tem TODAS as variáveis:
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- JWT_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL
- PORT
- NODE_ENV
- FRONTEND_URL

---

## Problema: Frontend mostra página em branco

### Solução:

**1. Abra o Console do navegador (F12)**
Veja qual é o erro exato.

**2. Limpe o cache**
```bash
# Pare o frontend (Ctrl+C)
# Delete a pasta .vite
rm -rf .vite

# Reinicie
npm run dev
```

**3. Reinstale dependências**
```bash
rm -rf node_modules
npm install
npm run dev
```

---

## Problema: "CORS error" no console

### Causa
Backend não está permitindo requisições do frontend.

### Solução:
Verifique se no `backend/.env` tem:
```env
FRONTEND_URL="http://localhost:3005"
```

**SEM barra no final!**

---

## Problema: Mudei o código mas não atualiza

### Frontend:
O Vite tem hot-reload automático. Se não funcionar:
1. Salve o arquivo novamente (Ctrl+S)
2. Recarregue o navegador (Ctrl+R)
3. Se ainda não funcionar, reinicie o servidor (Ctrl+C e `npm run dev`)

### Backend:
O ts-node-dev tem hot-reload automático. Se não funcionar:
1. Veja se não há erro de sintaxe no terminal
2. Reinicie o servidor (Ctrl+C e `npm run dev`)

---

## Checklist de Diagnóstico Rápido

Quando algo não funcionar, siga esta ordem:

- [ ] **Backend está rodando?** → Veja se a janela do terminal do backend está aberta
- [ ] **Backend responde?** → Teste http://localhost:3000/api/health
- [ ] **Frontend está rodando?** → Veja se a janela do terminal do frontend está aberta
- [ ] **Frontend abre?** → Teste http://localhost:3005
- [ ] **Banco conectado?** → Veja nos logs do backend se aparece "Conectado ao banco"
- [ ] **Usuários existem?** → Tente fazer login com `diretor@sigaj.com` / `senha123`
- [ ] **Console sem erros?** → Abra F12 no navegador e veja a aba Console

---

## Como Reiniciar Tudo do Zero

Se nada funcionar, faça um reset completo:

```bash
# 1. Mate todos os processos
# Feche todas as janelas de terminal abertas

# 2. Limpe as portas
netstat -ano | findstr :3000
taskkill /F /PID [número_que_apareceu]

netstat -ano | findstr :3005
taskkill /F /PID [número_que_apareceu]

# 3. Reinicie o projeto
# Clique duas vezes em:
start-local.bat
```

---

## Ainda Não Funcionou?

**Verifique:**
1. Node.js instalado: `node --version` (deve ser 18+)
2. npm instalado: `npm --version`
3. Dependências instaladas: Existe pasta `node_modules/`?

**Reinstale tudo:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd ..
rm -rf node_modules
npm install
```

---

## Logs Úteis para Debug

### Backend
Os logs aparecem no terminal onde você rodou `npm run dev`.

Procure por:
- ✅ "Servidor rodando na porta 3000" = OK
- ✅ "Conectado ao banco de dados" = OK
- ❌ "Error:" = Problema!

### Frontend
Abra o Console do navegador (F12 → Console).

Procure por:
- ❌ "ERR_CONNECTION_REFUSED" = Backend não está rodando
- ❌ "CORS error" = FRONTEND_URL incorreto no backend
- ❌ "401 Unauthorized" = Token inválido ou expirado
- ❌ "Network Error" = Backend offline

---

**Última atualização:** 2025-10-26
