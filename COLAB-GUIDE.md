# 🚀 Setup 100% Google Cloud + Colab

## 📋 O Que Você Precisa:

### 1. Conta Google (já tem!)
### 2. Projeto Google Cloud
### 3. Notebook Colab (gratuito)

## 🔧 PASSO A PASSO COMPLETO:

### ETAPA 1: Criar Projeto Google Cloud
1. Acesse: https://console.cloud.google.com
2. Clique em "Selecionar um projeto" > "NOVO PROJETO"
3. Nome: `univesp-voting-app`
4. Clique em "CRIAR"

### ETAPA 2: Ativar APIs Necessárias
1. No projeto, vá para "APIs e Serviços" > "Biblioteca"
2. Ative estas APIs:
   - Cloud Build API
   - Cloud Run API
   - Firebase Management API
   - Cloud Firestore API
   - Cloud Storage API

### ETAPA 3: Configurar Firebase
1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto Google Cloud
3. Configure:
   - Authentication (Email/Senha)
   - Firestore Database
   - Hosting

### ETAPA 4: Abrir Colab e Executar
1. Acesse: https://colab.research.google.com
2. Novo notebook
3. Upload do arquivo: `colab-setup.ipynb`
4. Execute as células em ordem

### ETAPA 5: Configurar Service Account
1. No Google Cloud, vá para "IAM e Admin" > "Service Accounts"
2. Crie service account
3. Baixe a chave JSON
4. No Colab, faça upload do arquivo

### ETAPA 6: Deploy Automático
1. Execute todas as células do notebook
2. O deploy será feito automaticamente
3. URL final: https://univesp-voting-app.web.app

## 🎯 Vantagens do Setup Colab:

✅ **Zero instalação local**
✅ **GPU gratuita** para build
✅ **Ambiente isolado**
✅ **Reproducível**
✅ **Integração Gemini Pro**
✅ **2TB storage**
✅ **Deploy automático**

## 🚀 URLs Finais:

- **App**: https://univesp-voting-app.web.app
- **Cloud Run**: https://univesp-voting-app-xxxxx.a.run.app
- **Colab**: https://colab.research.google.com/drive/...

## 💡 Alternativa: GitHub Actions + Google Cloud

Se preferir CI/CD:
1. Configure GitHub Actions
2. Conecte ao Google Cloud
3. Deploy automático a cada push

## 🎯 Resumo:

**Você PRECISA apenas:**
1. Criar projeto Google Cloud (5 min)
2. Ativar APIs (3 min)
3. Configurar Firebase (5 min)
4. Executar notebook Colab (2 min)

**Total: 15 minutos sem instalar NADA localmente!**
