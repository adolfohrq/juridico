# 🔐 Configuração do Google OAuth - SIGAJ

## ✅ Credenciais Já Criadas!

Você já criou as credenciais OAuth no Google Cloud Console. Agora precisamos configurar as URIs autorizadas.

---

## 📋 Suas Credenciais:

```
Projeto Google Cloud: juridico-476303
```

**✅ Suas credenciais OAuth estão armazenadas em:**
- `CONFIGURACAO_RENDER_LOCAL.txt` (não commitado no Git - arquivo local apenas)
- `backend/.env` (não commitado no Git - desenvolvimento local)

**⚠️ Segurança:** Por motivos de segurança, as credenciais OAuth não são commitadas no Git.
Use o arquivo `CONFIGURACAO_RENDER_LOCAL.txt` para configurar o Render.

---

## 🔧 Configuração Necessária no Google Cloud

### Passo 1: Adicionar URIs de Redirecionamento

1. Acesse: https://console.cloud.google.com/apis/credentials?project=juridico-476303
2. Clique no seu **OAuth 2.0 Client ID**
3. Role até **Authorized redirect URIs**
4. Clique em **ADD URI**

#### Adicione estas 2 URIs:

**URI 1 (Desenvolvimento Local):**
```
http://localhost:3000/api/auth/google/callback
```

**URI 2 (Produção - Render):**
```
https://juridico.onrender.com/api/auth/google/callback
```

5. Clique em **SAVE** no final da página
6. Aguarde 5-10 minutos para propagação

---

## 👥 Configurar Tela de Consentimento OAuth

### Passo 2: Adicionar Usuários de Teste

Como seu app está em modo "Testing", precisa adicionar emails que poderão fazer login:

1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=juridico-476303
2. Role até **Test users**
3. Clique em **ADD USERS**
4. Adicione os emails que poderão testar:

```
seu-email@gmail.com
outro-email@exemplo.com
```

5. Clique em **SAVE**

---

## 🚀 Publicar o App (Opcional)

Se quiser que QUALQUER usuário Google possa fazer login (não apenas os de teste):

1. Na tela de OAuth consent screen
2. Role até o topo
3. Clique em **PUBLISH APP**
4. Confirme

**⚠️ Atenção:** Isso vai permitir que qualquer pessoa com conta Google faça login. Se for um sistema interno, mantenha em "Testing" e adicione apenas usuários específicos.

---

## ✅ Checklist de Configuração

- [ ] Redirect URIs adicionadas (local + produção)
- [ ] Usuários de teste adicionados (se app em Testing)
- [ ] Aguardou 5-10 minutos para propagação
- [ ] Variáveis adicionadas no Render (vars 9, 10, 11)
- [ ] Backend reiniciado no Render

---

## 🧪 Testar Google OAuth

### Teste Local (Opcional)

Se quiser testar localmente primeiro:

1. No backend, certifique-se que o `.env` tem as credenciais
2. Execute:
   ```bash
   cd backend
   npm run dev
   ```
3. No frontend:
   ```bash
   npm run dev
   ```
4. Acesse: http://localhost:3005
5. Clique em "Login com Google" (se tiver implementado o botão)

### Teste em Produção

Após configurar tudo no Render e Vercel:

1. Acesse: https://juridico-seven.vercel.app
2. Clique em "Login com Google"
3. Selecione sua conta Google
4. Deve redirecionar para `/auth/callback`
5. E então para `/dashboard` já logado!

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa:** URI de callback não autorizada

**Solução:**
1. Verifique se adicionou: `https://juridico.onrender.com/api/auth/google/callback`
2. Sem barra no final!
3. Aguarde 5-10 minutos
4. Limpe cache do navegador (Ctrl+Shift+Del)

---

### Erro: "Access blocked: This app's request is invalid"

**Causa:** App está em Testing mode e seu email não está na lista de test users

**Solução:**
1. Adicione seu email em Test users
2. Ou publique o app (PUBLISH APP)

---

### Erro: "The OAuth client was not found"

**Causa:** Client ID incorreto ou não existe

**Solução:**
1. Verifique se o Client ID no Render está correto
2. Copie novamente das credenciais
3. Salve e reinicie o backend

---

### Login funciona mas não redireciona

**Causa:** FRONTEND_URL incorreta no backend

**Solução:**
1. No Render, verifique `FRONTEND_URL=https://juridico-seven.vercel.app`
2. SEM barra no final
3. Salve e aguarde reiniciar

---

## 📱 Implementar Botão de Login com Google no Frontend

Atualmente o botão pode não estar implementado na página de login. Para adicionar:

### No arquivo `src/pages/Login.jsx`, adicione:

```jsx
import { User } from '../entities/User';

// No componente Login:
const handleGoogleLogin = () => {
  User.loginWithGoogle();
};

// No JSX, adicione o botão:
<button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuar com Google
</button>
```

---

## 🎯 Resumo

**✅ Configuração OAuth:**
1. URIs de callback autorizadas no Google Cloud
2. Usuários de teste adicionados (se necessário)
3. Credenciais no Render (vars 9, 10, 11)
4. FRONTEND_URL correta no backend

**🔗 Links Úteis:**
- Credentials: https://console.cloud.google.com/apis/credentials?project=juridico-476303
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent?project=juridico-476303
- Test URIs:
  - Local: http://localhost:3000/api/auth/google/callback
  - Prod: https://juridico.onrender.com/api/auth/google/callback

---

**✨ Pronto! Agora seu sistema tem login com Google! 🎉**
