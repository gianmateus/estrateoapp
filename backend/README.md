# Estrateo Backend

Backend para o sistema Estrateo, desenvolvido com Node.js, TypeScript e Prisma.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Bcrypt para criptografia de senhas

## Requisitos

- Node.js 16+
- PostgreSQL 12+

## Instalação e Configuração

1. **Instalar dependências**

```bash
# Instalar dependências
npm install
```

2. **Configurar PostgreSQL**

- Certifique-se de que o PostgreSQL está instalado e em execução
- Crie um banco de dados chamado `estrateo`

```bash
# Via psql
psql -U postgres
CREATE DATABASE estrateo;
```

3. **Configurar variáveis de ambiente**

```bash
# Copiar o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações, especialmente:
- Configure a senha do PostgreSQL: `DB_PASSWORD=sua_senha`
- Atualize a URL do banco de dados: `DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/estrateo`

4. **Executar migrações do Prisma**

```bash
# Aplicar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate
```

5. **Iniciar o servidor**

```bash
# Modo desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em modo produção
npm start
```

## Estrutura de Pastas

- `src/controllers`: Controladores da aplicação
- `src/lib`: Bibliotecas e utilitários
- `src/routes`: Definição de rotas da API
- `src/middlewares`: Middlewares personalizados
- `src/config`: Arquivos de configuração
- `prisma`: Schema e migrações do banco de dados

## Endpoints da API

### Usuários

- `POST /api/users` - Criar novo usuário
- `GET /api/users` - Listar todos os usuários (requer autenticação)
- `GET /api/users/:id` - Buscar usuário pelo ID (requer autenticação)
- `PUT /api/users/:id` - Atualizar usuário (requer autenticação)
- `DELETE /api/users/:id` - Excluir usuário (requer autenticação)

### Autenticação

- `POST /api/auth/login` - Autenticar usuário e gerar token JWT
- `POST /api/auth/refresh` - Renovar token de acesso

### Pagamentos

- `GET /api/pagamentos` - Listar pagamentos (requer autenticação)
- `GET /api/pagamentos/:id` - Buscar pagamento pelo ID (requer autenticação)
- `POST /api/pagamentos` - Criar novo pagamento (requer autenticação)
- `PUT /api/pagamentos/:id` - Atualizar pagamento (requer autenticação)
- `DELETE /api/pagamentos/:id` - Excluir pagamento (requer autenticação)

### Inventário

- `GET /api/inventario` - Listar itens do inventário (requer autenticação)
- `GET /api/inventario/:id` - Buscar item pelo ID (requer autenticação)
- `POST /api/inventario` - Adicionar item ao inventário (requer autenticação)
- `PUT /api/inventario/:id` - Atualizar item (requer autenticação)
- `DELETE /api/inventario/:id` - Excluir item (requer autenticação)

## Autenticação

A API utiliza autenticação JWT. Para acessar endpoints protegidos, inclua o token no cabeçalho de requisição:

```
Authorization: Bearer <seu_token_jwt>
```

O token é obtido através do endpoint de login.

## Sistema de Permissões

### Visão Geral

A API implementa um sistema de controle de acesso baseado em permissões. Cada usuário possui um array de strings de permissões que define quais ações ele pode realizar no sistema.

#### Middleware de Permissões

O sistema utiliza um middleware de verificação de permissões que pode ser aplicado a rotas específicas:

```typescript
// Exemplo de uso do middleware de permissões
router.get('/pagamentos', 
  permissionMiddleware.checkPermission('view_pagamentos'), 
  pagamentoController.listar
);
```

### Funções Disponíveis

- `checkPermission(permission)`: Verifica se o usuário possui uma permissão específica ou uma de várias permissões
- `checkAllPermissions(permissions)`: Verifica se o usuário possui todas as permissões especificadas

### Permissões Principais

- **Admin**: `admin` (acesso total)
- **Pagamentos**: 
  - `view_pagamentos` - Visualizar pagamentos
  - `criar_pagamento` - Criar novos pagamentos
  - `editar_pagamento` - Editar pagamentos existentes
  - `excluir_pagamento` - Excluir pagamentos
- **Inventário**:
  - `view_inventario` - Visualizar inventário
  - `criar_inventario` - Criar novos itens
  - `editar_inventario` - Editar itens existentes
  - `excluir_inventario` - Excluir itens
- **Perfil**:
  - `view_perfil` - Visualizar próprio perfil
  - `editar_perfil` - Editar próprio perfil
- **Dashboard**:
  - `view_dashboard` - Acesso ao painel principal

---

# Estrateo Backend (English)

Backend for the Estrateo system, developed with Node.js, TypeScript and Prisma.

## Technologies

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT for authentication
- Bcrypt for password encryption

## Requirements

- Node.js 16+
- PostgreSQL 12+

## Installation and Setup

1. **Install dependencies**

```bash
# Install dependencies
npm install
```

2. **Configure PostgreSQL**

- Make sure PostgreSQL is installed and running
- Create a database called `estrateo`

```bash
# Via psql
psql -U postgres
CREATE DATABASE estrateo;
```

3. **Set up environment variables**

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your settings, especially:
- Set the PostgreSQL password: `DB_PASSWORD=your_password`
- Update the database URL: `DATABASE_URL=postgresql://postgres:your_password@localhost:5432/estrateo`

4. **Run Prisma migrations**

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

5. **Start the server**

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start in production mode
npm start
```

## Folder Structure

- `src/controllers`: Application controllers
- `src/lib`: Libraries and utilities
- `src/routes`: API route definitions
- `src/middlewares`: Custom middlewares
- `src/config`: Configuration files
- `prisma`: Database schema and migrations

## API Endpoints

### Users

- `POST /api/users` - Create new user
- `GET /api/users` - List all users (requires authentication)
- `GET /api/users/:id` - Find user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

### Authentication

- `POST /api/auth/login` - Authenticate user and generate JWT token
- `POST /api/auth/refresh` - Renew access token

### Payments

- `GET /api/pagamentos` - List payments (requires authentication)
- `GET /api/pagamentos/:id` - Find payment by ID (requires authentication)
- `POST /api/pagamentos` - Create new payment (requires authentication)
- `PUT /api/pagamentos/:id` - Update payment (requires authentication)
- `DELETE /api/pagamentos/:id` - Delete payment (requires authentication)

### Inventory

- `GET /api/inventario` - List inventory items (requires authentication)
- `GET /api/inventario/:id` - Find item by ID (requires authentication)
- `POST /api/inventario` - Add item to inventory (requires authentication)
- `PUT /api/inventario/:id` - Update item (requires authentication)
- `DELETE /api/inventario/:id` - Delete item (requires authentication)

## Authentication

The API uses JWT authentication. To access protected endpoints, include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained through the login endpoint.

## Permission System

### Overview

The API implements a permission-based access control system. Each user has an array of permission strings that defines which actions they can perform in the system.

#### Permission Middleware

The system uses a permission verification middleware that can be applied to specific routes:

```typescript
// Example of using the permission middleware
router.get('/payments', 
  permissionMiddleware.checkPermission('view_pagamentos'), 
  pagamentoController.listar
);
```

### Available Functions

- `checkPermission(permission)`: Checks if the user has a specific permission or one of several permissions
- `checkAllPermissions(permissions)`: Checks if the user has all specified permissions

### Main Permissions

- **Admin**: `admin` (full access)
- **Payments**: 
  - `view_pagamentos` - View payments
  - `criar_pagamento` - Create new payments
  - `editar_pagamento` - Edit existing payments
  - `excluir_pagamento` - Delete payments
- **Inventory**:
  - `view_inventario` - View inventory
  - `criar_inventario` - Create new items
  - `editar_inventario` - Edit existing items
  - `excluir_inventario` - Delete items
- **Profile**:
  - `view_perfil` - View own profile
  - `editar_perfil` - Edit own profile
- **Dashboard**:
  - `view_dashboard` - Access to main dashboard 