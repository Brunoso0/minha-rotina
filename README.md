# 📅 Minha Rotina

Aplicação web de planejamento pessoal para organização de tarefas diárias e metas mensais.

## ✨ Funcionalidades

- 📆 **Calendário Mensal** - Visualização completa de todos os dias do mês
- ✅ **Gerenciamento de Tarefas** - Adicione, complete e exclua tarefas por dia
- 🎯 **Metas Mensais** - Defina e acompanhe objetivos do mês
- 📊 **Estatísticas** - Visualize seu desempenho e taxa de conclusão
- 🌓 **Tema Claro/Escuro** - Interface adaptável à sua preferência
- 🔒 **Autenticação** - Sistema de login e registro de usuários
- 💾 **Persistência Local** - Dados salvos no navegador

## 🚀 Tecnologias

- [React](https://react.dev/) 19.2.0
- [Vite](https://vite.dev/) 7.3.1
- [lucide-react](https://lucide.dev/) - Biblioteca de ícones
- LocalStorage - Armazenamento de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/minha-rotina.git

# Entre no diretório
cd minha-rotina

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

## 🔑 Credenciais de Acesso

Para testar a aplicação, utilize:

- **Email:** admin@example.com
- **Senha:** 123456

Ou crie uma nova conta na tela de login.

## 🔒 Segurança

- ✓ Hash de senhas antes do armazenamento
- ✓ Sanitização de inputs contra XSS
- ✓ Validação de email
- ✓ Limite de caracteres em formulários

## 📝 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ usando React e Vite
