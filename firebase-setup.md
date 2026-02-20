# 🔥 Firebase Setup Guide

## 1. Criar Projeto Firebase
1. Acesse: https://console.firebase.google.com
2. Clique em "Adicionar projeto"
3. Nome: `univesp-voting-app`
4. Continue com as opções padrão
5. Clique em "Criar projeto"

## 2. Configurar Services
### Authentication
1. Vá para Authentication > Primeiros passos
2. Ative "Email/Senha"
3. Ative "Email/Password"
4. Salve

### Firestore Database
1. Vá para Firestore Database > Criar banco
2. Escolha "Iniciar em modo de teste"
3. Região: `southamerica-east1`
4. Crie

### Hosting
1. Vá para Hosting > Primeiros passos
2. Instale Firebase CLI: `npm install -g firebase-tools`
3. Faça login: `firebase login`
4. Inicialize: `firebase init`

## 3. Configurar Regras Firestore
Cole estas regras no Firestore:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users podem ver/editar próprio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Todos podem ver projetos
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    // Todos podem ver votos, usuário só pode votar
    match /votes/{voteId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == request.resource.data.user_id;
    }
  }
}

## 4. Deploy
firebase deploy --only hosting
