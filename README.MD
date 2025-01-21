# Simulador de Imposto de Renda

Este projeto simula o preenchimento de declarações de imposto de renda com backend em **NestJS** e frontend em **ReactJS**. O backend utiliza **PostgreSQL** para armazenar os dados e **Jest** para testes unitários.

---

## 📌 Tecnologias

- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend**: NextJS, TypeScript, TailwindCSS
- **Banco de Dados**: PostgreSQL
- **Testes**: Jest
- **Containerização**: Docker

---

## ⚙️ Configuração das Variáveis de Ambiente

Crie um arquivo `.env` para definir as variáveis de ambiente do backend e do frontend.

### 🔹 Backend

**Caso esteja utilizando Docker**, crie o arquivo `.env` dentro da pasta `backend` com:

```ini
POSTGRES_HOST=simulador-ir-db-1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_NAME=simulador_ir
JWT_SECRET={SUA_CHAVE_SECRETA}
PORT=8000
```
### 🔹 Frontend
O arquivo .env deve ser criado na pasta frontend e é o mesmo para qualquer ambiente:

```ini
VITE_API_URL=http://localhost:8000
VITE_PORT=5173
```
## 🚀 Como Executar o Projeto
### 🔹 Com Docker

Este é o método mais simples para rodar o projeto sem precisar instalar dependências manualmente.

1. Clone o repositório:

bash
git clone https://github.com/gusalveess/simulador-ir.git
cd simulador-ir
```
2. Inicie os containers do backend e banco de dados PostgreSQL:

bash
sudo docker-compose up --build
```
3. Acesse a aplicação:

bash
Backend: http://localhost:8000
Frontend: http://localhost:5173
```
### 🔹 Sem Docker (Rodando Localmente)
1. Instale as dependências do backend e frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```
2. Configure o banco de dados PostgreSQL localmente criando a base de dados:

```sql
CREATE DATABASE simulador_ir;
```
3. Criação das tabelas (necessário apenas se rodando sem Docker):

```sql
CREATE TABLE IF NOT EXISTS public.usuarios
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP DEFAULT now(),
    "twoFactorSecret" VARCHAR,
    "is2FAEnabled" BOOLEAN DEFAULT false
);
```

```sql
CREATE TABLE IF NOT EXISTS public.declaracoes
(
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    dados JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'Não Submetida',
    "criadoEm" TIMESTAMP DEFAULT now(),
    "usuarioId" INTEGER REFERENCES public.usuarios(id) ON DELETE CASCADE
);
```
4. Inicie o backend:

```bash
cd backend
npm run start:dev
```
5. Inicie o frontend:

```bash
cd frontend
npm run dev
```

5. Acesse a aplicação:

```bash
Backend: http://localhost:8000
Frontend: http://localhost:5173
```

## 🧪 Testes Unitários com Jest
O backend utiliza Jest para testes unitários. Para rodar os testes:

### Com Docker:

```bash
docker-compose exec backend npm run test
```
### Sem Docker (localmente):

```bash
cd backend
npm run test
```

## 📜 Documentação da API
A API possui documentação no Swagger, acessível em:

```bash
http://localhost:8000/docs
```

## 🚀 CI/CD Pipeline
O projeto utiliza GitHub Actions para Integração Contínua (CI) e Entrega Contínua (CD).

### 🔹 Backend
A pipeline é acionada automaticamente nos seguintes eventos:

- Push para o branch main
- Pull Request para o branch main

O processo é dividido em duas etapas principais:

1. **Testes**: Em seguida, o código é testado automaticamente. Os testes são executados para garantir que as funcionalidades estejam funcionando corretamente, e um relatório de cobertura de testes é gerado.
   
2. **Build**: Por fim, o processo de build é realizado, preparando o código para a produção e verificando se o processo de compilação é bem-sucedido.
### 🔹 Frontend
A pipeline para o frontend segue uma abordagem similar, sendo acionada automaticamente nos seguintes eventos:

- Push para o branch main
- Pull Request para o branch main

As etapas incluem:

1. **Instalação de Dependências**: O GitHub Actions instala todas as dependências necessárias para o projeto frontend.
   
2. **Build**: O código é compilado usando o Vite para gerar a versão de produção da aplicação.

## 🎯 Agora seu projeto está organizado e pronto para rodar de forma eficiente!
