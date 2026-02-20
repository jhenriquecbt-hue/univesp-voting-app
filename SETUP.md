# 🚀 Setup Rápido - Univesp Voting App

## ⚡ Passos Imediatos

### 1️⃣ Instalar Node.js (OBRIGATÓRIO)
```bash
# Baixe e instale de: https://nodejs.org
# Após instalar, verifique:
node --version
npm --version
```

### 2️⃣ Configurar Supabase
1. Vá para https://supabase.com
2. Crie novo projeto: `univesp-voting-app`
3. Copie URL e chave anon de Settings > API
4. Crie arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3️⃣ Configurar Banco de Dados
1. No Supabase, vá para SQL Editor
2. Cole todo o conteúdo de `schema.sql`
3. Clique em "Run"

### 4️⃣ Configurar Autenticação
1. Vá para Authentication > Settings
2. Site URL: `http://localhost:5173`
3. Redirect URLs: `http://localhost:5173/**`

### 5️⃣ Instalar Dependências e Executar
```bash
npm install
npm run dev
```

### 6️⃣ Testar
- Abra: http://localhost:5173
- Use e-mail: `teste@aluno.univesp.br`

## 🔧 Arquivos Configurados

✅ `.env.example` - Template de variáveis de ambiente
✅ `src/supabase.js` - Configurado para usar variáveis de ambiente
✅ `.gitignore` - Já inclui `.env`
✅ `schema.sql` - Banco de dados completo

## 🎯 Funcionalidades

- 🔐 Autenticação (@aluno.univesp.br apenas)
- 📝 Formulário de projetos com contadores
- 🗳️ Votação (exatamente 3 projetos)
- 📊 Dashboard com gráficos em tempo real
- 🎨 Design Bauhaus

## 🚀 Deploy

Para deploy em produção:
1. Configure variáveis de ambiente na plataforma
2. Atualize URLs no Supabase para o domínio de produção
