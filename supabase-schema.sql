-- Dropar tabelas existentes (se houver)
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS goals CASCADE;

-- Tabela de tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_date DATE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  context TEXT DEFAULT 'pessoal' CHECK (context IN ('pessoal', 'profissional')),
  time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  context TEXT CHECK (context IN ('pessoal', 'profissional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tasks
CREATE POLICY "Usuários podem ver apenas suas próprias tarefas"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias tarefas"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias tarefas"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para goals
CREATE POLICY "Usuários podem ver apenas suas próprias metas"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias metas"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias metas"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias metas"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_date_idx ON tasks(task_date);
CREATE INDEX IF NOT EXISTS tasks_context_idx ON tasks(context);
CREATE INDEX IF NOT EXISTS tasks_user_date_context_idx ON tasks(user_id, task_date, context);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_month_year_idx ON goals(month, year);
CREATE INDEX IF NOT EXISTS goals_context_idx ON goals(context);
CREATE INDEX IF NOT EXISTS goals_user_month_year_context_idx ON goals(user_id, month, year, context);
