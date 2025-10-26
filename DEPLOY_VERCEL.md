# 🚀 Guia de Deploy no Vercel - SIGAJ Frontend

Guia passo a passo para fazer deploy do frontend SIGAJ no Vercel (100% gratuito).

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Backend já deployado no Render.com e funcionando
- [ ] URL do backend anotada (ex: `https://sigaj-backend.onrender.com`)
- [ ] Código do frontend commitado no GitHub/GitLab
- [ ] Conta no Vercel (criar usando GitHub)

---

## 📝 Preparação (Já Feito!)

Os seguintes arquivos já foram criados e configurados:

✅ `vercel.json` - Configurações do Vercel
✅ `.env` - Variáveis locais de desenvolvimento
✅ `.env.example` - Exemplo para outros desenvolvedores
✅ `.env.production` - Template para produção (você vai editar)
✅ `src/pages/GoogleCallback.jsx` - Página de callback do Google OAuth
✅ `src/App.jsx` - Rota de callback adicionada
✅ `.gitignore` - Atualizado

---

## 🔧 Passo 1: Atualizar .env.production

Antes de fazer o deploy, você precisa atualizar o arquivo `.env.production` com a URL real do seu backend.

1. Abra o arquivo `.env.production`
2. Substitua `seu-backend.onrender.com` pela URL real do Render:

```env
# Backend API URL
VITE_API_BASE_URL=https://sigaj-backend.onrender.com/api

# Google OAuth URL
VITE_GOOGLE_AUTH_URL=https://sigaj-backend.onrender.com/api/auth/google
```

> **Importante**: Use a URL EXATA que o Render gerou para você!

3. Salve o arquivo (mas NÃO commite ainda - vamos configurar no Vercel)

---

## 🌐 Passo 2: Fazer Commit e Push

```bash
# Adicionar todos os arquivos novos
git add .

# Commit com mensagem descritiva
git commit -m "Preparar frontend para deploy no Vercel"

# Push para o repositório
git push origin main
```

> Se você ainda não tem um repositório Git:

```bash
git init
git add .
git commit -m "Initial commit - SIGAJ frontend"
git branch -M main
git remote add origin https://github.com/seu-usuario/sigaj.git
git push -u origin main
```

---

## 🚀 Passo 3: Deploy no Vercel

### 3.1. Criar Conta no Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub** (recomendado)
4. Autorize o Vercel a acessar seus repositórios

### 3.2. Importar Projeto

1. No dashboard do Vercel, clique em **Add New** → **Project**
2. Selecione seu repositório do GitHub
3. Se não aparecer, clique em **Adjust GitHub App Permissions** e autorize

### 3.3. Configurar Projeto

Na tela de configuração:

#### Framework Preset
- **Framework**: Vite (detecta automaticamente)

#### Root Directory
- Deixe como está: `.` (raiz do projeto)
- Se o frontend estiver em uma subpasta, ajuste aqui

#### Build Settings
- **Build Command**: `npm run build` (já preenchido)
- **Output Directory**: `dist` (já preenchido)
- **Install Command**: `npm install` (já preenchido)

### 3.4. Adicionar Environment Variables

Esta é a parte mais importante! Clique em **Environment Variables** e adicione:

**Variable 1:**
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://sigaj-backend.onrender.com/api` (use sua URL real!)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `VITE_GOOGLE_AUTH_URL`
- **Value**: `https://sigaj-backend.onrender.com/api/auth/google` (use sua URL real!)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

> ⚠️ **MUITO IMPORTANTE**:
> - Use HTTPS (não HTTP)
> - Inclua `/api` no final da primeira URL
> - Inclua `/api/auth/google` no final da segunda URL
> - Confira se não tem espaços extras

### 3.5. Deploy!

1. Clique em **Deploy**
2. Aguarde de 2-4 minutos
3. 🎉 Você verá uma tela de sucesso com confetes!

---

## 🔗 Passo 4: Obter URL do Frontend

Após o deploy, o Vercel gera uma URL automática:

```
https://sigaj-xxx.vercel.app
```

ou

```
https://seu-projeto.vercel.app
```

**Anote essa URL!** Você vai precisar dela nos próximos passos.

---

## ⚙️ Passo 5: Atualizar Backend (CORS)

Agora você precisa atualizar o backend para aceitar requisições do frontend.

### 5.1. No Render.com

1. Acesse [https://dashboard.render.com](https://dashboard.render.com)
2. Clique no seu serviço backend (`sigaj-backend`)
3. Vá em **Environment**
4. Encontre a variável `FRONTEND_URL`
5. Edite e coloque a URL do Vercel:

```
https://sigaj-xxx.vercel.app
```

6. Clique em **Save Changes**
7. O backend vai reiniciar automaticamente (aguarde 1-2 minutos)

### 5.2. Testar CORS

Abra o console do navegador (F12) e acesse seu frontend. Se aparecer erros de CORS, verifique:

- ✅ `FRONTEND_URL` no Render está correto
- ✅ Não tem espaços ou barras extras
- ✅ Usa HTTPS (não HTTP)
- ✅ Backend já reiniciou completamente

---

## 🔐 Passo 6: Atualizar Google OAuth (Se Usar)

Se você configurou login com Google, precisa adicionar a URL do Vercel:

### 6.1. No Google Cloud Console

1. Acesse [https://console.cloud.google.com](https://console.cloud.google.com)
2. Selecione seu projeto SIGAJ
3. Vá em **APIs & Services** → **Credentials**
4. Clique no seu **OAuth 2.0 Client ID**

### 6.2. Adicionar Redirect URI

Em **Authorized redirect URIs**, adicione:

```
https://sigaj-backend.onrender.com/api/auth/google/callback
```

(Use a URL do seu backend no Render!)

**NÃO remova** a URL de desenvolvimento:
```
http://localhost:3000/api/auth/google/callback
```

### 6.3. Salvar

1. Clique em **Save**
2. Aguarde 5-10 minutos para propagação
3. Teste o login com Google no frontend

---

## ✅ Passo 7: Testar o Sistema

### 7.1. Acessar o Frontend

Abra no navegador:
```
https://sigaj-xxx.vercel.app
```

### 7.2. Testar Login

Use as credenciais de teste:

- **Email**: `diretor@sigaj.com`
- **Senha**: `senha123`

Outros usuários:
- `vice@sigaj.com` / `senha123`
- `chefe@sigaj.com` / `senha123`
- `tecnico1@sigaj.com` / `senha123`

### 7.3. Testar Google OAuth (Opcional)

1. Clique em "Login com Google" (se implementado na página de login)
2. Selecione sua conta Google
3. Deve redirecionar e fazer login automaticamente

### 7.4. Verificar Funcionalidades

- [ ] Dashboard carrega corretamente
- [ ] Lista de pedidos aparece
- [ ] Pode criar novo pedido
- [ ] Estatísticas carregam
- [ ] Logs de atividade funcionam
- [ ] Logout funciona

---

## 🔄 Atualizações Futuras

### Deploy Automático

O Vercel detecta automaticamente novos commits:

```bash
# Fazer alterações no código
git add .
git commit -m "Melhorias no frontend"
git push origin main

# Vercel faz deploy automático em 2-3 minutos!
```

### Preview Deployments

Branches e PRs geram URLs de preview automáticas:

```bash
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git push origin feature/nova-funcionalidade

# Vercel cria: https://sigaj-xxx-feature-nova-funcionalidade.vercel.app
```

---

## 🎨 Passo 8: Customizar Domínio (Opcional)

### 8.1. Comprar Domínio

Você pode usar:
- [Registro.br](https://registro.br) - R$ 40/ano (.com.br)
- [Namecheap](https://namecheap.com) - ~US$ 10/ano
- [Hostinger](https://hostinger.com.br) - R$ 40/ano

### 8.2. Adicionar no Vercel

1. No Vercel, vá em **Settings** → **Domains**
2. Digite seu domínio: `sigaj.seudominio.com`
3. Siga as instruções para configurar DNS

#### Registros DNS (exemplo):

| Type | Name | Value |
|------|------|-------|
| A | sigaj | 76.76.21.21 |
| CNAME | www.sigaj | cname.vercel-dns.com |

### 8.3. Aguardar Propagação

- DNS pode levar de 5 minutos a 48 horas
- O Vercel emite SSL (HTTPS) automaticamente
- Você receberá email quando estiver pronto

### 8.4. Atualizar Backend

Depois, atualize `FRONTEND_URL` no Render para seu domínio customizado:

```
https://sigaj.seudominio.com
```

---

## 🐛 Troubleshooting

### Erro: "Page Not Found" ao acessar rotas diretas

**Causa**: SPA routing não configurado

**Solução**: O arquivo `vercel.json` já está configurado com rewrites. Se o erro persistir:

1. Verifique se `vercel.json` existe na raiz
2. Faça redeploy: **Deployments** → **⋯** → **Redeploy**

### Erro: "Failed to fetch" ou CORS

**Causa**: Backend não aceita requisições do frontend

**Solução**:
1. Verifique `FRONTEND_URL` no Render
2. Deve ser a URL EXATA do Vercel (com HTTPS)
3. Sem barra no final
4. Reinicie o backend no Render

### Erro: "Cannot read properties of undefined"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. No Vercel, vá em **Settings** → **Environment Variables**
2. Verifique se `VITE_API_BASE_URL` e `VITE_GOOGLE_AUTH_URL` existem
3. Valores devem ter HTTPS
4. Redeploy: **Deployments** → último deploy → **⋯** → **Redeploy**

### Build falha

**Causa**: Erros no código ou dependências

**Solução**:
1. Teste localmente: `npm run build`
2. Se funcionar local, pode ser cache: **Settings** → **General** → **Clear Cache**
3. Verifique os logs de build na aba **Deployments**

### Google OAuth não funciona

**Causas possíveis**:

1. **Redirect URI não configurada**
   - Adicione no Google Cloud Console
   - Aguarde 5-10 minutos

2. **URL errada no backend**
   - Verifique `GOOGLE_CALLBACK_URL` no Render
   - Deve ser: `https://SEU-BACKEND.onrender.com/api/auth/google/callback`

3. **Client ID/Secret incorretos**
   - Verifique no Render se estão corretos
   - Redeploy após corrigir

### Site lento no primeiro acesso

**Causa**: Render free tier "dorme" após 15 min de inatividade

**Solução**:
- É normal no plano grátis
- Primeira requisição leva 30-60s
- Depois fica rápido
- Para evitar: use [UptimeRobot](https://uptimerobot.com) (grátis) para fazer ping a cada 5 min

---

## 📊 Analytics (Opcional)

### Vercel Analytics (Grátis)

1. No Vercel, vá em **Analytics**
2. Clique em **Enable Analytics**
3. Veja métricas de performance e acessos

### Google Analytics

Adicione no `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 Segurança

### Headers de Segurança

Já configurado no `vercel.json`:

✅ `X-Content-Type-Options: nosniff`
✅ `X-Frame-Options: DENY`
✅ `X-XSS-Protection: 1; mode=block`

### HTTPS

✅ Automático no Vercel
✅ SSL renovado automaticamente
✅ HTTP redireciona para HTTPS

### Environment Variables

✅ Nunca commite `.env` no Git
✅ Use apenas no Vercel Dashboard
✅ Variáveis são encriptadas

---

## 📈 Limites do Plano Grátis Vercel

| Recurso | Limite Grátis |
|---------|---------------|
| Banda | 100GB/mês |
| Builds | 100h/mês |
| Deployments | Ilimitado |
| Sites | Ilimitado |
| Team Members | 1 |
| Serverless Functions | 100GB-Hrs |

**É mais que suficiente para produção!** 🎉

---

## 🎯 Checklist Final

Antes de anunciar o sistema:

- [ ] Frontend acessível no Vercel
- [ ] Backend funcionando no Render
- [ ] Banco de dados no Supabase com dados
- [ ] Login com email/senha funciona
- [ ] Google OAuth funciona (se configurado)
- [ ] CORS configurado corretamente
- [ ] Todas as páginas carregam
- [ ] Dashboard mostra dados reais
- [ ] Pode criar/editar/deletar pedidos
- [ ] Logs de atividade funcionam
- [ ] Testar com diferentes cargos de usuário
- [ ] Testar em mobile (responsivo)

---

## 🎉 Parabéns!

Seu sistema SIGAJ está no ar!

**URLs Finais:**
- 🌐 **Frontend**: https://sigaj-xxx.vercel.app
- 🔧 **Backend**: https://sigaj-backend.onrender.com
- 💾 **Banco**: Supabase Cloud

**Custo Total: R$ 0,00/mês** 🚀

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Status Vercel**: https://vercel-status.com
- **Community**: https://github.com/vercel/vercel/discussions

---

**Desenvolvido com ❤️ usando Claude Code**

Sistema completo e online! 🎊
