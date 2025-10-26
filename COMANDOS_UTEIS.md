# 🛠️ Comandos Úteis - SIGAJ

Guia rápido de comandos para desenvolvimento e deploy do SIGAJ.

---

## 📦 Instalação

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 🚀 Desenvolvimento Local

### Frontend (porta 3005)
```bash
npm run dev
```

### Backend (porta 3000)
```bash
cd backend
npm run dev
```

### Abrir ambos em paralelo (Windows)
```bash
# Terminal 1
npm run dev

# Terminal 2 (nova janela)
cd backend && npm run dev
```

---

## 🗄️ Banco de Dados (Prisma)

### Gerar Cliente Prisma
```bash
cd backend
npm run prisma:generate
```

### Criar/Aplicar Migrations
```bash
cd backend
npm run prisma:migrate
# Vai perguntar o nome da migration
```

### Popular Banco com Dados de Teste
```bash
cd backend
npm run prisma:seed
```

### Abrir Prisma Studio (Interface Visual)
```bash
cd backend
npm run prisma:studio
# Abre em http://localhost:5555
```

### Resetar Banco (CUIDADO!)
```bash
cd backend
npx prisma migrate reset
# Apaga tudo e recria
```

---

## 🏗️ Build e Preview

### Build Frontend
```bash
npm run build
# Gera pasta /dist
```

### Preview do Build
```bash
npm run preview
# Testa o build localmente
```

### Build Backend
```bash
cd backend
npm run build
# Gera pasta /dist
```

### Rodar Build do Backend
```bash
cd backend
npm start
```

---

## 🧹 Limpeza e Manutenção

### Limpar Cache do Vite
```bash
rm -rf node_modules/.vite
# Windows: rmdir /s /q node_modules\.vite
```

### Limpar node_modules
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Limpar Build
```bash
# Frontend
rm -rf dist

# Backend
cd backend
rm -rf dist
```

---

## 🔍 Testes e Validação

### Testar Conexão com Backend
```bash
curl http://localhost:3000/api/health
```

### Testar Login na API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diretor@sigaj.com","password":"senha123"}'
```

### Ver Logs do Backend (desenvolvimento)
```bash
cd backend
npm run dev
# Mostra todos os logs no terminal
```

---

## 📝 Git e Deploy

### Commit Básico
```bash
git add .
git commit -m "Sua mensagem aqui"
git push origin main
```

### Criar Branch
```bash
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git add .
git commit -m "Nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### Ver Status
```bash
git status
git log --oneline -10
```

---

## 🌐 Deploy

### Backend (Render)
```bash
# 1. Fazer push para GitHub
git push origin main

# 2. No Render, ele detecta e faz deploy automático

# 3. Após deploy, executar no Shell do Render:
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

### Frontend (Vercel)
```bash
# 1. Fazer push para GitHub
git push origin main

# 2. Vercel detecta e faz deploy automático
# Deploy leva ~2-3 minutos
```

### Forçar Redeploy (Vercel)
```bash
# No dashboard do Vercel:
# Deployments → último deploy → ⋯ → Redeploy
```

---

## 🔐 Variáveis de Ambiente

### Ver Variáveis (local)
```bash
# Frontend
cat .env

# Backend
cd backend
cat .env
```

### Copiar Templates
```bash
# Frontend
cp .env.example .env

# Backend
cd backend
cp .env.example .env
```

---

## 🐛 Debug e Troubleshooting

### Ver Versões
```bash
node --version
npm --version
git --version
```

### Verificar Porta em Uso (Windows)
```bash
# Ver o que está na porta 3000
netstat -ano | findstr :3000

# Ver o que está na porta 3005
netstat -ano | findstr :3005
```

### Matar Processo na Porta (Windows)
```bash
# Descobrir o PID
netstat -ano | findstr :3000

# Matar o processo
taskkill /PID <número-do-pid> /F
```

### Ver Logs de Erro (desenvolvimento)
```bash
# Frontend: Abrir console do navegador (F12)
# Backend: Ver terminal onde rodou npm run dev
```

---

## 📊 Prisma - Comandos Avançados

### Ver SQL Gerado
```bash
cd backend
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

### Validar Schema
```bash
cd backend
npx prisma validate
```

### Formatar Schema
```bash
cd backend
npx prisma format
```

### Criar Migration sem Aplicar
```bash
cd backend
npx prisma migrate dev --create-only
```

---

## 🔄 Sincronizar Fork (se usou fork)

```bash
# Adicionar upstream
git remote add upstream https://github.com/original/repo.git

# Buscar alterações
git fetch upstream

# Merge
git merge upstream/main

# Push
git push origin main
```

---

## 💡 Atalhos Úteis

### Abrir VS Code
```bash
code .
```

### Abrir Navegador (Windows)
```bash
start http://localhost:3005
```

### Abrir Prisma Studio + Frontend + Backend
```bash
# Terminal 1
npm run dev

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd backend && npm run prisma:studio
```

---

## 📦 Atualizar Dependências

### Ver Pacotes Desatualizados
```bash
npm outdated
```

### Atualizar Todos
```bash
npm update
```

### Atualizar Um Específico
```bash
npm install axios@latest
```

---

## 🎯 Comandos de Produção

### Verificar Logs (Render)
```bash
# No dashboard do Render:
# Seu serviço → Logs (aba)
```

### Verificar Logs (Vercel)
```bash
# No dashboard do Vercel:
# Seu projeto → Deployments → último → Logs
```

### Executar Comando no Render (Shell)
```bash
# No dashboard do Render:
# Seu serviço → Shell (aba)
# Digite o comando e Enter
```

---

## 🔥 Comandos de Emergência

### Banco travado? Resetar conexões
```bash
cd backend
# No Supabase Dashboard → SQL Editor:
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'postgres' AND pid <> pg_backend_pid();
```

### Site fora do ar? Verificar status
```bash
# Backend
curl https://seu-backend.onrender.com/api/health

# Se retornar erro, aguarde 1-2 minutos (pode estar acordando)
```

### Limpar tudo e recomeçar
```bash
# Frontend
rm -rf node_modules dist .vite package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules dist package-lock.json
npm install
npm run prisma:generate
```

---

## 📚 Links Úteis

- **Prisma Docs**: https://www.prisma.io/docs
- **Vite Docs**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**💡 Dica**: Salve este arquivo nos favoritos para referência rápida!
