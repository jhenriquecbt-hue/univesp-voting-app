-- Schema SQL para o Sistema de Votação de Projetos Univesp
-- Execute este script no seu projeto Supabase

-- Tabela de Usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  summary TEXT CHECK (char_length(summary) <= 500),
  techniques TEXT CHECK (char_length(techniques) <= 600),
  example TEXT CHECK (char_length(example) <= 1000),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Votos
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id) -- Impede voto duplicado no mesmo projeto
);

-- Políticas de Segurança (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários inserirem seus próprios dados
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política para todos verem projetos
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Política para usuários inserirem seus próprios projetos
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios projetos
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para todos verem votos
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

-- Política para usuários inserirem seus próprios votos
CREATE POLICY "Users can insert own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios votos
CREATE POLICY "Users can delete own votes" ON votes
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_project_id ON votes(project_id);

-- Função para contar votos por projeto
CREATE OR REPLACE FUNCTION count_votes_by_project()
RETURNS TABLE(project_id UUID, vote_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as project_id,
    COALESCE(COUNT(v.id), 0) as vote_count
  FROM projects p
  LEFT JOIN votes v ON p.id = v.project_id
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
