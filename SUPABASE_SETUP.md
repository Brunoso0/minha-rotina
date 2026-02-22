# 🚀 Instruções de Configuração do Supabase

## Passo 1: Executar o SQL no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `supabase-schema.sql` e cole no editor
5. Clique em **Run** para executar o script

O script criará:
- Tabela `tasks` - Para armazenar tarefas diárias
- Tabela `goals` - Para armazenar metas mensais
- Políticas RLS (Row Level Security) - Para segurança dos dados
- Índices para melhor performance

## Passo 2: Verificar as Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deverá ver as tabelas `tasks` e `goals` criadas
3. Verifique se o RLS está habilitado (ícone de cadeado verde)

## Passo 3: Confirmar Autenticação

1. No menu lateral, clique em **Authentication**
2. Certifique-se de que **Email Auth** está habilitado em **Providers**
3. (Opcional) Em **Email Templates**, personalize os emails de confirmação

## Passo 4: Testar a Aplicação

1. Execute `npm run dev` no terminal
2. Acesse http://localhost:5173
3. Clique em **"Não tem conta? Registe-se aqui"**
4. Crie uma nova conta com seu email
5. Verifique se o registro funciona e você é redirecionado para o dashboard

## Passo 5: Verificar Dados no Supabase

1. Adicione algumas tarefas e metas na aplicação
2. Volte ao Supabase Dashboard
3. No **Table Editor**, clique em `tasks` e `goals`
4. Confirme que os dados aparecem nas tabelas

## ⚠️ Problemas Comuns

### Erro: "column 'date' does not exist"
- Este erro já foi corrigido no schema. A coluna usa `task_date` ao invés de `date` (palavra reservada do PostgreSQL)
- Certifique-se de usar a versão mais recente do `supabase-schema.sql`

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente no `.env` estão corretas
- Confirme que a `VITE_SUPABASE_URL` não tem `/` no final
- Reinicie o servidor dev (`npm run dev`)

### Erro: "new row violates row-level security policy"
- Certifique-se de que o SQL foi executado completamente
- Verifique se as políticas RLS foram criadas corretamente
- Execute `SELECT * FROM pg_policies;` no SQL Editor para listar as políticas

### Usuário criado mas não consegue fazer login
- Verifique se o email de confirmação foi enviado (check spam)
- No Supabase, vá em **Authentication > Users** e confirme manualmente o usuário
- Ou desabilite a confirmação de email em **Authentication > Settings**

### Dados não aparecem após login
- Abra o console do navegador (F12) e veja se há erros
- Verifique se o `user_id` está sendo enviado corretamente nas requisições
- Confirme que as políticas RLS permitem SELECT para o usuário autenticado

## ✅ Tudo Funcionando?

Se tudo estiver OK, você verá:
- ✓ Registro de novos usuários funcionando
- ✓ Login com email/senha funcionando
- ✓ Tarefas sendo salvas no banco de dados
- ✓ Metas sendo salvas no banco de dados
- ✓ Dados persistindo após limpar cache/cookies
- ✓ Cada usuário vendo apenas seus próprios dados

## 📧 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador (F12 > Console)
2. Verifique os logs no Supabase (Logs > Functions/API)
3. Revise as variáveis de ambiente no arquivo `.env`
