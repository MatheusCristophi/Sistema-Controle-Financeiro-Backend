# Gerenciamento Financeiro — Backend (NestJS)

API REST para controle financeiro pessoal, com cadastro de usuários, categorias, transações (receitas e despesas) e um dashboard com resumos mensais. O saldo do usuário é atualizado automaticamente a cada transação criada, editada ou removida.

## Stack

- **NestJS 11** (Node.js / TypeScript)
- **TypeORM 11** + **PostgreSQL**
- **JWT** (`@nestjs/jwt`) para autenticação, com **Passport**
- **bcrypt** para hash de senhas
- **decimal.js** para cálculos monetários precisos
- **class-validator** / **class-transformer** para validação de DTOs

## Arquitetura

- **Herança de tabela única (Single Table Inheritance)**: `TransactionEntity` é a entidade base, com `IncomeEntity` e `ExpensesEntity` como subtipos (`@ChildEntity`), diferenciados pela coluna `type`.
- **Transações de banco de dados**: criação, atualização e exclusão de transações usam `QueryRunner` do TypeORM para garantir atomicidade entre a alteração da transação e a atualização do saldo (`balance`) do usuário.
- **Guard de autenticação global por rota**: `AuthGuard` valida o JWT via header `Authorization: Bearer <token>` e injeta o payload em `request.user`. Rotas podem ser marcadas como públicas com o decorator `@Public()`.
- **Decorator `@CurrentUser()`**: extrai o usuário autenticado (payload do JWT) diretamente nos controllers.

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | Registro e login de usuários, emissão de JWT |
| `users` | Consulta de saldo, atualização e exclusão do próprio usuário |
| `category` | CRUD de categorias de transação, vinculadas ao usuário |
| `transactions` | Criação, atualização e exclusão de receitas/despesas |
| `dashboard` | Resumos: saldo total de receitas/despesas e listagem do mês corrente |

## Modelo de dados

**UserEntity**
- `id` (uuid), `name`, `email` (único), `password` (hash), `balance` (decimal, padrão `0`)
- Relações: `1:N` com `CategoryEntity` e `TransactionEntity`

**CategoryEntity**
- `id`, `description` (único), `createDate`
- Relação: `N:1` com `UserEntity`, `1:N` com `TransactionEntity`

**TransactionEntity** (base, `type` = `Incomes` ou `Expenses`)
- `id`, `description`, `type`, `value` (decimal), `paymentMethod`, `transactionDate`
- Relações: `N:1` com `UserEntity` e `CategoryEntity`

**Enums**
- `PaymentMethod`: `PIX`, `TRANSFERÊNCIA BANCARIA`, `BOLETO`, `DEBITO`, `CRÉDITO`
- `TransactionType`: `Incomes`, `Expenses`

## Endpoints

Todas as rotas abaixo, exceto `/registrar` e `/logar`, exigem o header:
```
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/register` | Cria um novo usuário |
| POST | `/login` | Autentica e retorna o token JWT |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/users` | Retorna o saldo do usuário autenticado |
| PUT | `/users` | Atualiza dados do usuário autenticado |
| DELETE | `/users` | Remove o usuário autenticado |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| POST | `/category` | Cria uma categoria |
| POST | `/category/name` | Busca categoria pelo nome |
| GET | `/category/all` | Lista todas as categorias do usuário |
| PUT | `/category/:id` | Atualiza uma categoria |
| DELETE | `/category/:id` | Remove uma categoria |

### Transações

| Método | Rota | Descrição |
|---|---|---|
| POST | `/transactions/:id` | Cria uma transação na categoria `:id` (atualiza o saldo) |
| PUT | `/transactions/:cid/:tid` | Atualiza a transação `:tid` da categoria `:cid` (recalcula o saldo) |
| DELETE | `/transactions/:id` | Remove a transação `:id` (reverte o efeito no saldo) |

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/income` | Soma total de receitas do usuário |
| GET | `/dashboard/expense` | Soma total de despesas do usuário |
| GET | `/dashboard/allincomes` | Lista as receitas do mês corrente |
| GET | `/dashboard/allexpenses` | Lista as despesas do mês corrente |

## Configuração

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz com base em `.env.example`:
   ```env
   DB_HOST=database_host
   DB_PORT=database_port
   DB_USERNAME=database_username
   DB_PASSWORD=database_password
   DB_DATABASE=database_name
   JWT_SECRET=your_secret
   JWT_EXPIRATION_TIME=time_in_miliseconds
   ```

3. Garanta que exista um banco PostgreSQL acessível com as credenciais informadas. As tabelas são criadas automaticamente pelo TypeORM (`synchronize: true`) — recomendado apenas para desenvolvimento.

## Executando o projeto

```bash
# download das dependências
npm install

# desenvolvimento (watch mode)
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API sobe por padrão na porta `3000` (ou na porta definida em `PORT`).


## Observações

- `synchronize: true` está habilitado no `TypeOrmModule` — adequado para desenvolvimento, mas deve ser substituído por migrations em produção.
- CORS está liberado para qualquer origem (`origin: true`) sem envio de credenciais.
