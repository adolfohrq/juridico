# 🚀 Início Rápido - SIGAJ

## Windows (Mais Fácil!)

Clique duas vezes em:
```
start-local.bat
```

Isso vai:
1. ✅ Iniciar o backend (porta 3000)
2. ✅ Iniciar o frontend (porta 3005)
3. ✅ Abrir o navegador automaticamente

---

## Manual (Qualquer SO)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```bash
npm install
npm run dev
```

### Abrir no Navegador
```
http://localhost:3005
```

---

## 🔑 Login de Teste

```
Email:    diretor@sigaj.com
Senha:    senha123
```

**Outros usuários disponíveis:**
- `vice@sigaj.com` - Vice Diretor
- `chefe@sigaj.com` - Chefe de Setor
- `tecnico1@sigaj.com` - Técnico
- `tecnico2@sigaj.com` - Técnico

Todos com senha: `senha123`

---

## ✅ Verificar se Está Funcionando

**Backend Health Check:**
```
http://localhost:3000/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- [RODAR_LOCAL.md](RODAR_LOCAL.md) - Guia completo de desenvolvimento local
- [STATUS_DEPLOY.md](STATUS_DEPLOY.md) - Status do deploy online

---

## ⚡ Pronto para Usar!

O sistema já está configurado e pronto para rodar. Todas as credenciais do banco de dados (Supabase) já estão no arquivo `backend/.env`.
