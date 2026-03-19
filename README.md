# Student +

Sistema frontend de gerenciamento de alunos, professores e administração desenvolvido com React 19, Vite e React Router DOM.

## Sobre o Projeto

**Student+** é uma plataforma web completa para gestão acadêmica que permite:
- Autenticação de usuários (Alunos, Professores e Administradores)
- Cadastro e gerenciamento de alunos
- Visualização de dashboard para professores
- Sistema de matrículas com controle administrativo
- Gerenciamento de perfis de usuários
- Painel administrativo completo para gerenciamento de admins e matrículas

A aplicação foi desenvolvida com as mais recentes tecnologias do ecossistema React e está hospedada em produção em https://studentplus-olive.vercel.app.

## Tecnologias Utilizadas

### Frontend
- **React** (^19.2.0) - Biblioteca JavaScript para criar interfaces de usuário reativas
- **Vite** (^7.2.4) - Build tool ultra-rápido com HMR (Hot Module Replacement)
- **React Router DOM** (^7.13.0) - Roteamento e navegação na aplicação
- **React Icons** (^5.6.0) - Biblioteca de ícones SVG para React
- **Lucide React** (^0.577.0) - Ícones modernos e minimalistas

### Desenvolvimento
- **SWC** (@vitejs/plugin-react-swc) - Compilador JavaScript super rápido
- **ESLint** (^9.39.1) - Linting e padronização de código
- **TypeScript** types - Tipagem para melhor DX

## Estrutura do Projeto

```
FrontEnd-Student-/
├── public/                           # Arquivos públicos
├── src/
│   ├── components/
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── auth/                # Autenticação
│   │   │   │   ├── login/           # Página de login
│   │   │   │   │   ├── index.jsx
│   │   │   │   │   └── login.css
│   │   │   │   └── cadastro/        # Página de cadastro
│   │   │   │       ├── index.jsx
│   │   │   │       └── cadastro.css
│   │   │   ├── aluno/               # Dashboard do aluno
│   │   │   │   ├── index.jsx
│   │   │   │   └── aluno.css
│   │   │   ├── professores/         # Dashboard de professores
│   │   │   │   ├── index.jsx
│   │   │   │   └── professores.css
│   │   │   ├── admin/               # Painel administrativo
│   │   │   │   ├── index.jsx        # Admin dashboard principal
│   │   │   │   ├── adminCommon.jsx  # Componentes comuns admin
│   │   │   │   ├── matriculas.jsx   # Gerenciamento de matrículas
│   │   │   │   └── admin.css
│   │   │   └── perfil/              # Página de perfil
│   │   │       ├── index.jsx
│   │   │       └── perfil.css
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── index.jsx            # SideBar/Layout principal
│   │   │   └── SideBar.css
│   │   └── notification/            # Sistema de notificações
│   │       ├── Notification.jsx
│   │       └── notification.css
│   ├── assets/                       # Recursos estáticos
│   │   ├── logo.svg                 # Logo da aplicação
│   │   ├── perfil.svg               # Ícone de perfil
│   │   └── react.svg                # Ícone React
│   ├── App.jsx                       # Componente raiz com rotas
│   ├── App.css                       # Estilos globais da app
│   ├── main.jsx                      # Ponto de entrada
│   ├── index.css                     # Estilos globais
│   └── ...
├── index.html                        # Arquivo HTML principal
├── package.json                      # Dependências do projeto
├── vite.config.js                    # Configuração do Vite
├── eslint.config.js                  # Configuração do ESLint
├── .gitignore                        # Arquivos ignorados pelo Git
├── LICENSE                           # Licença MIT
└── README.md                         # Este arquivo
```

## Instalação

### Pré-requisitos
- **Node.js** (v14.0.0 ou superior)
- **npm** (v6.0.0 ou superior) ou **yarn**

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/3G-Student/FrontEnd-Student-.git
cd FrontEnd-Student-
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

A aplicação será aberta automaticamente em `http://localhost:5173` (porta padrão do Vite).

## Funcionalidades Principais

### Autenticação
- **Login** - Autenticação de usuários
- **Cadastro** - Registro de novos usuários

### Dashboard do Aluno
- Visualização de informações pessoais
- Consulta de matrículas
- Acesso a dados acadêmicos
- Edição de perfil

### Dashboard do Professor
- Visualização de alunos cadastrados
- Gerenciamento de informações de alunos
- Listagem de turmas/matrículas
- Acesso ao perfil pessoal

### Painel Administrativo
- **Gerenciamento de Admins** - CRUD de administradores
- **Gerenciamento de Matrículas** - Controle completo de matrículas
- **Dashboard Administrativo** - Visão geral do sistema
- **Componentes Comuns** - Componentes reutilizáveis para admin

## Rotas da Aplicação

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/` | Cadastro | Página inicial - Cadastro de novos usuários | Público |
| `/login` | Login | Página de login | Público |
| `/aluno` | Aluno Dashboard | Dashboard do aluno | Aluno |
| `/professores` | Professores Dashboard | Dashboard de professores | Professor |
| `/perfil` | Perfil | Página de perfil do usuário | Autenticado |
| `/admin` | Admin Dashboard | Painel principal administrativo | Admin |
| `/admin/admins` | UserManagementDashboard | Gerenciamento de administradores | Admin |
| `/admin/matriculas` | Matriculas | Gerenciamento de matrículas | Admin |

## Deployment

A aplicação está hospedada em: **https://studentplus-olive.vercel.app**

### Deploy com Vercel
O projeto é automaticamente deployado na Vercel. Cada push para a branch main gera um novo build.

---

**Desenvolvido com ❤️ pela equipe 3G-Student**

*Última atualização: 2026-03-19 11:06:32*
