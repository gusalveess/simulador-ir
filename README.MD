# Simulador de Imposto de Renda

Este projeto simula o preenchimento de declarações de imposto de renda com backend em **NestJS** e frontend em **ReactJS**. O backend utiliza **PostgreSQL** para armazenar os dados e **Jest** para testes unitários.

## Tecnologias

- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend**: NextJS, TypeScript, TailwindCSS
- **Banco de Dados**: PostgreSQL
- **Testes**: Jest
- **Containerização**: Docker

## Banco de Dados

Antes de rodar o projeto, certifique-se de criar o banco de dados e as tabelas necessárias. Use os scripts abaixo para configurar o banco localmente:

```ini
-- Criar database
CREATE DATABASE simulador_ir;

-- Table: public.usuarios

CREATE TABLE IF NOT EXISTS public.usuarios
(
    id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
    nome character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "senhaHash" text COLLATE pg_catalog."default" NOT NULL,
    "criadoEm" timestamp without time zone NOT NULL DEFAULT now(),
    "twoFactorSecret" character varying COLLATE pg_catalog."default",
    "is2FAEnabled" boolean NOT NULL DEFAULT false,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

-- Table: public.declaracoes

CREATE TABLE IF NOT EXISTS public.declaracoes
(
    id integer NOT NULL DEFAULT nextval('declaracoes_id_seq'::regclass),
    ano integer NOT NULL,
    dados jsonb NOT NULL,
    status character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'nao submetida'::character varying,
    "criadoEm" timestamp without time zone NOT NULL DEFAULT now(),
    "usuarioId" integer,
    CONSTRAINT declaracoes_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_136377835de7020dd99dad8ce6b" FOREIGN KEY ("usuarioId")
        REFERENCES public.usuarios (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
TABLESPACE pg_default;
```

## Como Executar o Projeto

### Com Docker

Este método é o mais simples para rodar o projeto de forma isolada, sem a necessidade de instalação de dependências adicionais.

1. Clone o repositório para sua máquina:

    ```bash
    git clone https://github.com/gusalveess/simulador-ir.git
    cd simulador-ir
    ```

2. Rode o Docker Compose para construir e iniciar os containers (backend e banco de dados PostgreSQL):

    ```bash
    docker-compose up --build
    ```

3. O **backend** estará disponível em `http://localhost:8000` e o **frontend** em `http://localhost:3000`.

4. Se você quiser rodar os testes unitários back-end do **Jest** no Docker, use:

    ```bash
    docker-compose exec backend npm run test
    ```

### Sem Docker (Localmente)

Se preferir rodar o projeto sem Docker, siga as etapas abaixo.

1. **Instale as dependências** no backend e no frontend:

    No backend:

    ```bash
    cd backend
    npm install
    ```

    No frontend:

    ```bash
    cd frontend
    npm install
    ```


2. **Crie o arquivo `.env` no backend** com a seguinte configuração:

    ```ini
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER={SEU_USUÁRIO_LOCAL_DO_POSTGRES}
    POSTGRES_PASSWORD={SUA_SENHA_DO_POSTGRES}
    DATABASE_NAME=simulador_ir
    JWT_SECRET={VALOR DE SUA ESCOLHA}
    PORT=8000
    ```

3. **Execute o backend**:

    No backend, use:

    ```bash
    npm run start:dev
    ```

4. **Execute o frontend**:

    No frontend, use:

    ```bash
    npm run start
    ```

Agora, o backend estará rodando em `http://localhost:8000` e o frontend em `http://localhost:3000`.

## Testes Unitários com Jest

O projeto utiliza **Jest** para testes unitários no backend. Para rodar os testes:

1. Se estiver usando Docker:

    ```bash
    docker-compose exec backend npm run test
    ```

2. Se rodando localmente:

    ```bash
    cd backend
    npm run test
    ```

## Documentação da API

A documentação da API em Swagger pode ser acessada no endpoint `http://localhost:8000/docs` após a execução da aplicação.

## CI/CD Pipeline

Este projeto está configurado com um pipeline de Integração Contínua (CI) e Entrega Contínua (CD) utilizando o GitHub Actions. O fluxo de CI/CD foi projetado para garantir que cada alteração no código seja validada de maneira automática e eficiente, antes de ser integrada ao código principal.

#### Fluxo de Trabalho
A pipeline é acionada automaticamente nos seguintes eventos:

Push para o branch main
Pull Request para o branch main
O processo é dividido em duas etapas principais:

Testes: Em seguida, o código é testado automaticamente. Os testes são executados para garantir que as funcionalidades estejam funcionando corretamente, e um relatório de cobertura de testes é gerado.

Build: Por fim, o processo de build é realizado, preparando o código para a produção e verificando se o processo de compilação é bem-sucedido.