# 🚀 Setup 100% Google Cloud

## 📋 Passo a Passo Completo

### 1️⃣ Criar Projeto Firebase/Google Cloud
1. Acesse: https://console.firebase.google.com
2. Clique em "Adicionar projeto"
3. Nome: `univesp-voting-app`
4. Continue com opções padrão
5. Clique em "Criar projeto"

### 2️⃣ Configurar Services
#### Authentication
- Authentication > Primeiros passos
- Ative "Email/Senha"
- Configure domínios permitidos

#### Firestore Database
- Firestore Database > Criar banco
- Modo teste (30 dias)
- Região: `southamerica-east1`

#### Cloud Storage
- Storage > Primeiros passos
- Configure regras de segurança
- 2TB disponível automaticamente

#### Cloud Functions
- Functions > Primeiros passos
- Configure para Node.js 18

### 3️⃣ Configurar Ambiente Local
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Google
firebase login

# Inicializar projeto
firebase init

# Instalar dependências
npm install
```

### 4️⃣ Configurar Variáveis de Ambiente
- Copie `.env.firebase` para `.env`
- Substitua com suas credenciais reais

### 5️⃣ Deploy Completo
```bash
# Deploy frontend
firebase deploy --only hosting

# Deploy backend functions
firebase deploy --only functions

# Deploy tudo
firebase deploy
```

## 🎯 URLs Finais
- **Frontend**: https://univesp-voting-app.web.app
- **API Functions**: https://southamerica-east1-univesp-voting-app.cloudfunctions.net
- **Storage**: gs://univesp-voting-app.appspot.com

## 💡 Vantagens do Ecossistema Google
- ✅ 2TB de storage
- ✅ Gemini Pro integrado
- ✅ Zero custo para pequeno uso
- ✅ Escalabilidade infinita
- ✅ Monitoramento completo
- ✅ SSL automático
- ✅ CDN global
