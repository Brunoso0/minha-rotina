# 📅 FlowRoutine

Aplicação web de planejamento pessoal para organização de tarefas diárias e metas mensais com fluidez e praticidade.

## ✨ Funcionalidades

- 📆 **Calendário Mensal** - Visualização completa de todos os dias do mês
- ✅ **Gerenciamento de Tarefas** - Adicione, complete e exclua tarefas por dia
- 🎯 **Metas Mensais** - Defina e acompanhe objetivos do mês
- 📊 **Estatísticas** - Visualize seu desempenho e taxa de conclusão
- 🌓 **Tema Claro/Escuro** - Interface adaptável à sua preferência
- 🔒 **Autenticação** - Sistema de login e registro com Supabase
- 💾 **Persistência em Nuvem** - Dados salvos no Supabase

## 🚀 Tecnologias

- [React](https://react.dev/) 19.2.0
- [Vite](https://vite.dev/) 7.3.1
- [Supabase](https://supabase.com/) - Backend e autenticação
- [lucide-react](https://lucide.dev/) - Biblioteca de ícones

## ⚙️ Configuração do Supabase

### 1. Crie um projeto no Supabase

Acesse [supabase.com](https://supabase.com) e crie um novo projeto.

### 2. Execute o SQL para criar as tabelas

No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo `supabase-schema.sql`:

```sql
-- Tabela de tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_date DATE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_month_year_idx ON goals(month, year);

```

Este script cria as tabelas `tasks` e `goals` com Row Level Security (RLS) habilitado.

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase (encontradas em **Settings > API**):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica
```

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/flowroutine.git

# Entre no diretório
cd flowroutine

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:5173 no navegador.

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa verificação de código
```

## 📂 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Calendar/    # Componente de calendário
│   ├── Modal/       # Modal de tarefas diárias
│   └── Sidebar/     # Painel lateral (metas e estatísticas)
├── pages/           # Páginas da aplicação
│   ├── Login/       # Página de autenticação
│   └── Dashboard/   # Página principal
├── services/        # Lógica de negócios e API
│   ├── auth.js      # Serviço de autenticação
│   ├── taskService.js
│   └── goalService.js
├── hooks/           # Custom React Hooks
│   ├── useAuth.js
│   └── useDarkMode.js
├── utils/           # Funções auxiliares
│   └── dateHelpers.js
└── styles/          # Estilos globais
    └── index.css
```

## � Segurança

- ✓ Autenticação via Supabase Auth
- ✓ Row Level Security (RLS) no banco de dados
- ✓ Sanitização de inputs contra XSS
- ✓ Validação de email
- ✓ Limite de caracteres em formulários
- ✓ Cada usuário acessa apenas seus próprios dados

## 📝 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido usando React e Vite
