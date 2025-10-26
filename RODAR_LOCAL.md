# 🏠 Como Rodar o SIGAJ Localmente

Este guia ensina como executar o projeto completo na sua máquina, mantendo apenas o banco de dados no Supabase (sem precisar do Render ou Vercel).

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- ✅ **Node.js** (versão 18+)
- ✅ **npm** (vem com Node.js)
- ✅ **Git** (para clonar o repositório)

---

## 🚀 Passo a Passo

### 1. Preparar o Backend

Abra um terminal e execute:

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Gere o Prisma Client (necessário para o TypeScript reconhecer os tipos)
npx prisma generate
```

**✅ Pronto!** O backend está configurado.

---

### 2. Preparar o Frontend

Abra **OUTRO terminal** (mantenha o primeiro aberto) e execute:

```bash
# Volte para a pasta raiz do projeto
cd ..

# Instale as dependências do frontend
npm install
```

**✅ Pronto!** O frontend está configurado.

---

### 3. Iniciar o Backend

**No primeiro terminal** (pasta `backend`):

```bash
npm run dev
```

**Você verá:**
```
🚀 Server rodando na porta 3000
🌍 Backend disponível em: http://localhost:3000
✅ Conectado ao banco de dados!
```

**✅ Backend rodando em:** http://localhost:3000

---

### 4. Iniciar o Frontend

**No segundo terminal** (pasta raiz):

```bash
npm run dev
```

**Você verá:**
```
  VITE v5.4.10  ready in 432 ms

  ➜  Local:   http://localhost:3005/
  ➜  Network: use --host to expose
```

**✅ Frontend rodando em:** http://localhost:3005

---

## 🎯 Testar o Sistema

### 1. Abrir o Frontend

No navegador, acesse:
```
http://localhost:3005
```

### 2. Fazer Login

Use uma das credenciais de teste:

| Usuário | Email | Senha | Cargo |
|---------|-------|-------|-------|
| Diretor | `diretor@sigaj.com` | `senha123` | DIRETOR |
| Vice | `vice@sigaj.com` | `senha123` | VICE_DIRETOR |
| Chefe | `chefe@sigaj.com` | `senha123` | CHEFE_SETOR |
| Técnico 1 | `tecnico1@sigaj.com` | `senha123` | TECNICO |
| Técnico 2 | `tecnico2@sigaj.com` | `senha123` | TECNICO |

### 3. Explorar o Sistema

- ✅ Dashboard com estatísticas
- ✅ Criar novo pedido
- ✅ Visualizar pedidos existentes
- ✅ Atribuir pedidos (apenas Diretor/Vice)
- ✅ Adicionar comentários
- ✅ Ver histórico de atividades

---

## 🔍 Verificar se Está Funcionando

### Backend Health Check

No navegador ou terminal:
```bash
# No navegador:
http://localhost:3000/api/health

# Ou no terminal (Windows):
curl http://localhost:3000/api/health
```

**✅ Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T..."
}
```

### Testar API Diretamente (Opcional)

```bash
# Login via curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"diretor@sigaj.com\",\"password\":\"senha123\"}"
```

**✅ Deve retornar:** `accessToken`, `refreshToken` e dados do `user`

---

## 📂 Estrutura de Portas

| Serviço | Porta | URL Local |
|---------|-------|-----------|
| **Backend** | 3000 | http://localhost:3000 |
| **Frontend** | 3005 | http://localhost:3005 |
| **Banco de Dados** | - | Supabase (online) |

---

## 🛠️ Comandos Úteis

### Backend (pasta `backend/`)

```bash
# Iniciar servidor de desenvolvimento (com hot-reload)
npm run dev

# Compilar TypeScript para produção
npm run build

# Iniciar versão compilada
npm start

# Executar migrations no banco
npx prisma migrate dev

# Aplicar migrations (sem criar novas)
npx prisma migrate deploy

# Repovoar banco com dados de teste
npx ts-node prisma/seed.ts

# Ver dados do banco no navegador
npx prisma studio
```

### Frontend (pasta raiz `/`)

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Visualizar build de produção
npm run preview
```

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"

**Problema:** Já existe algo rodando na porta 3000

**Solução:**
```bash
# Windows: Encontre e mate o processo
netstat -ano | findstr :3000
taskkill /PID [número_do_processo] /F

# Ou mude a porta no backend/.env:
PORT=3001
```

### Erro: "Cannot connect to database"

**Problema:** Credenciais do Supabase incorretas

**Solução:**
1. Abra `backend/.env`
2. Verifique se `DATABASE_URL` está correto
3. Teste a conexão:
```bash
cd backend
npx prisma db pull
```

### Erro: "Prisma Client not generated"

**Problema:** Tipos do Prisma não foram gerados

**Solução:**
```bash
cd backend
npx prisma generate
```

### Frontend não conecta no backend

**Problema:** URL do backend incorreta

**Solução:**
1. Verifique se o backend está rodando: http://localhost:3000/api/health
2. Confirme que `.env.local` existe na raiz com:
```
VITE_API_URL=http://localhost:3000/api
```
3. Reinicie o frontend (Ctrl+C e `npm run dev` novamente)

### Página em branco no frontend

**Problema:** Erro de JavaScript no console

**Solução:**
1. Abra as ferramentas de desenvolvedor (F12)
2. Vá em "Console"
3. Veja o erro exato
4. Verifique se o backend está respondendo

---

## 🔄 Reiniciar Banco de Dados

Se quiser limpar tudo e começar do zero:

```bash
cd backend

# Recriar todas as tabelas
npx prisma migrate reset

# Isso vai:
# 1. Apagar todas as tabelas
# 2. Recriar as tabelas
# 3. Executar o seed automaticamente
```

---

## 🌐 Diferenças: Local vs Online

| Aspecto | Local | Online (Render/Vercel) |
|---------|-------|------------------------|
| **Backend** | http://localhost:3000 | https://juridico.onrender.com |
| **Frontend** | http://localhost:3005 | https://juridico-seven.vercel.app |
| **Banco de Dados** | Supabase (mesmo) | Supabase (mesmo) |
| **Hot Reload** | ✅ Sim | ❌ Não |
| **Velocidade** | ⚡ Instantâneo | 🐌 Pode demorar (free tier) |
| **Google OAuth** | ⚠️ Precisa configurar | ✅ Já configurado |

---

## ⚙️ Configuração de Variáveis de Ambiente

### Backend: `backend/.env`

⚠️ **IMPORTANTE:** O arquivo `backend/.env` já existe no projeto com todas as credenciais configuradas.

Se você precisar criar um novo, use este template:

```env
# Database - Obtenha no Supabase
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"

# JWT - Gere chaves aleatórias seguras
JWT_SECRET="sua-chave-secreta-aqui"
JWT_REFRESH_SECRET="sua-chave-refresh-secreta-aqui"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Google OAuth - Configure no Google Cloud Console
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Server
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3005"
```

> 📝 **Nota:** Para obter as credenciais reais, veja o arquivo `backend/.env` que já está configurado no projeto.

### Frontend: `.env.local`

```env
# Backend local
VITE_API_URL=http://localhost:3000/api

# Porta do frontend
PORT=3005
```

---

## 📝 Checklist de Configuração

Antes de rodar, certifique-se:

- [ ] Node.js instalado (`node --version`)
- [ ] Backend: `npm install` executado
- [ ] Backend: `npx prisma generate` executado
- [ ] Frontend: `npm install` executado
- [ ] Arquivo `backend/.env` existe e está configurado
- [ ] Arquivo `.env.local` existe na raiz
- [ ] Nenhum outro serviço usando portas 3000 ou 3005

---

## 🎉 Tudo Pronto!

Agora você pode desenvolver localmente com:

✅ **Hot reload** - Mudanças no código aparecem instantaneamente
✅ **Debug fácil** - Console.log funciona perfeitamente
✅ **Velocidade** - Sem delays de network
✅ **Banco real** - Mesmo Supabase da produção

**Para parar os servidores:** Aperte `Ctrl+C` em cada terminal

**Para rodar novamente:** Apenas execute `npm run dev` em cada pasta

---

## 📚 Próximos Passos

- [Entender a arquitetura](ARQUITETURA.md)
- [Configurar Google OAuth local](GOOGLE_OAUTH_SETUP.md)
- [Fazer deploy online](STATUS_DEPLOY.md)

---

**Criado em:** 2025-10-26
**Banco de dados:** Supabase PostgreSQL
**Status:** ✅ Totalmente funcional
