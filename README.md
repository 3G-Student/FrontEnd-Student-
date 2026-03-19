# Cadastro Aluno

Sistema de cadastro e gerenciamento de alunos para professores desenvolvido com React e Vite.

## 📋 Sobre o Projeto

O **Cadastro Aluno** é uma aplicação web que permite professores gerenciarem o cadastro de seus alunos de forma simples e eficiente. A aplicação oferece funcionalidades de autenticação, cadastro de alunos, visualização de dashboards e gerenciamento de perfil.

## 🚀 Tecnologias Utilizadas

- **React** (^19.2.0) - Biblioteca JavaScript para criar interfaces de usuário
- **Vite** (^7.2.4) - Build tool rápido e moderno
- **React Router DOM** (^7.13.0) - Gerenciamento de rotas na aplicação
- **React Icons** (^5.6.0) - Biblioteca de ícones para React
- **SWC** - Compilador JavaScript rápido
- **ESLint** - Ferramenta de linting para padronização de código

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Pages/
│   │   ├── professores/
│   │   │   ├── login.jsx          # Página de login
│   │   │   ├── cadastro.jsx       # Página de cadastro
│   │   │   └── index.jsx          # Dashboard do professor
│   │   └── perfil/
│   │       └── index.jsx          # Página de perfil
│   └── ...
├── assets/                         # Imagens e recursos estáticos
├── App.jsx                         # Componente principal com rotas
├── main.jsx                        # Ponto de entrada da aplicação
├── App.css                         # Estilos da aplicação
└── index.css                       # Estilos globais
```

## 🔧 Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Passo a Passo

1. Clone o repositório:
```bash
git clone https://github.com/3G-Student/FrontEnd-Student-.git
cd FrontEnd-Student-
```

2. Instale as dependências:
```bash
npm install
```

3. Instale as dependências adicionais:
```bash
npm install react-router-dom
npm install react-icons
```

## 🎯 Funcionalidades

- ✅ **Login** - Autenticação de professores
- ✅ **Cadastro** - Registro de novos usuários
- ✅ **Dashboard** - Visualização de alunos cadastrados
- ✅ **Perfil** - Gerenciamento de perfil do professor
- ✅ **Navegação** - Sistema de rotas intuitivo

## 📍 Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Cadastro | Página inicial de cadastro |
| `/login` | Login | Página de login |
| `/professores` | DashboardProfessor | Dashboard do professor |
| `/perfilProfessor` | Perfil | Página de perfil do professor |

## 🚀 Como Executar

### Modo de Desenvolvimento
```bash
npm run dev
```
Abre a aplicação em `http://localhost:5173` (porta padrão do Vite)

### Build para Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com HMR (Hot Module Replacement)
- `npm run build` - Cria um build otimizado para produção
- `npm run lint` - Valida o código com ESLint
- `npm run preview` - Visualiza o build de produção localmente

## 📦 Dependências Principais

### Runtime
- react: UI library
- react-dom: React para web
- react-router-dom: Gerenciamento de rotas
- react-icons: Biblioteca de ícones

### Development
- Vite: Build tool
- ESLint: Code linter
- SWC: JavaScript compiler rápido
- TypeScript types: Tipagem para React

## 🤝 Contribuindo

Sinta-se livre para fazer fork deste projeto e enviar pull requests com melhorias.

## 📄 Licença

Este projeto está sob licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 👥 Autores

**3G-Student** - Desenvolvimento da aplicação

---

**Desenvolvido com ❤️**