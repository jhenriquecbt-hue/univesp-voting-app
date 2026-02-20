<<<<<<< HEAD
# Univesp Voting App

Sistema de submissão e votação de projetos para grupo universitário da Univesp.

## Tecnologias

- **Frontend**: React 18 + Vite
- **Estilização**: Tailwind CSS (Design System Bauhaus)
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Backend**: Supabase
- **Autenticação**: Supabase Auth

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie as credenciais do seu projeto
3. No arquivo `src/supabase.js`, substitua:
   - `SEU_SUPABASE_URL` pela URL do seu projeto
   - `SUA_SUPABASE_ANON_KEY` pela chave anônima

### 3. Configurar Banco de Dados

Execute o conteúdo do arquivo `schema.sql` no SQL Editor do seu projeto Supabase.

### 4. Configurar Autenticação

No painel do Supabase:
1. Vá para Authentication > Settings
2. Em Site URL, adicione: `http://localhost:5173`
3. Em Redirect URLs, adicione: `http://localhost:5173/**`

## Executar o Projeto

```bash
npm run dev
```

Acesse `http://localhost:5173`

## Funcionalidades

### 🔐 Autenticação
- Login e cadastro de usuários
- Validação restrita para e-mails `@aluno.univesp.br`
- Sessão persistente

### 📝 Submissão de Projetos
- Formulário com validação
- Contadores de caracteres em tempo real
- Campos: Nome, Resumo (500), Técnicas (600), Exemplo (1000), URL da Imagem

### 🗳️ Sistema de Votação
- Grid de projetos com cards
- Seleção de exatamente 3 projetos
- Impedimento de voto no próprio projeto
- Interface visual de seleção

### 📊 Dashboard em Tempo Real
- Gráfico de barras com votos por projeto (Recharts)
- Barra de progresso de participação do grupo
- Estatísticas gerais
- Navegação rápida para as funcionalidades

### 🎨 Design System Bauhaus
- Minimalismo e foco na função
- Cores: Fundo off-white, textos cinza chumbo, acentos em vermelho/azul
- Tipografia Inter/Roboto (proibido Montserrat)
- Formas geométricas bem definidas

## Estrutura do Projeto

```
src/
├── components/
│   ├── Login.jsx              # Tela de autenticação
│   ├── Dashboard.jsx          # Dashboard principal
│   ├── ProjectSubmission.jsx   # Formulário de projetos
│   └── Voting.jsx             # Sistema de votação
├── contexts/
│   └── AuthContext.jsx        # Contexto de autenticação
├── supabase.js                # Configuração do Supabase
├── App.jsx                    # Rotas da aplicação
├── main.jsx                   # Ponto de entrada
└── index.css                  # Estilos globais
```

## Regras de Negócio

### Autenticação
- ✅ Apenas e-mails `@aluno.univesp.br` são permitidos
- ✅ Validação no frontend e backend

### Votação
- ✅ Usuário deve selecionar exatamente 3 projetos
- ✅ Não pode votar no próprio projeto
- ✅ Um voto por projeto por usuário

### Projetos
- ✅ Um projeto por usuário
- ✅ Limites de caracteres respeitados
- ✅ URL da imagem opcional

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte React/Vite.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

MIT License
=======
# univesp-voting-app
Sistema de votação de projetos para grupo universitário Univesp - SPA em React com autenticação restrita e dashboard em tempo real.
>>>>>>> da6e1d2f518c995b6944eaa0d2ec7780c25f58f8
