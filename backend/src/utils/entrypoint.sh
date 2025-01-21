#!/bin/bash

# Inicializar o PostgreSQL em segundo plano
docker-entrypoint.sh postgres &

# Aguardar o PostgreSQL estar pronto para conexões
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Aguardando o PostgreSQL iniciar..."
  sleep 2
done

echo "PostgreSQL está pronto para conexões."

# Criar o banco de dados separadamente (fora de transações)
psql -U postgres -d postgres -c "CREATE DATABASE simulador_ir;"

# Executar as queries no banco de dados simulador_ir
psql -U postgres -d simulador_ir -c "
-- Table: public.usuarios
CREATE TABLE IF NOT EXISTS public.usuarios
(
    id serial PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senhaHash TEXT NOT NULL,
    criadoEm TIMESTAMP DEFAULT now(),
    twoFactorSecret VARCHAR,
    is2FAEnabled BOOLEAN DEFAULT false
);

-- Table: public.declaracoes
CREATE TABLE IF NOT EXISTS public.declaracoes
(
    id serial PRIMARY KEY,
    ano INT NOT NULL,
    dados JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'nao submetida',
    criadoEm TIMESTAMP DEFAULT now(),
    usuarioId INT,
    CONSTRAINT fk_usuario FOREIGN KEY (usuarioId) REFERENCES public.usuarios(id) ON DELETE CASCADE
);
"

# Aguardar o container rodar
wait