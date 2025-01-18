# Usar Node.js 18 LTS como base
FROM node:18

# Evitar saída de logs desnecessários do npm
ENV NPM_CONFIG_LOGLEVEL=warn 

# Atualizar pacotes do sistema e instalar dependências
RUN apt-get update && apt-get install -y \
    sudo zsh vim less httpie redis-tools htop postgresql-client jq curl git \
    && apt-get clean

# Criar o diretório de trabalho
RUN mkdir -p /home/node/app

# Configurar o ambiente para o usuário root
USER root
WORKDIR /home/node/app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./ 

# Instalar as dependências do projeto
RUN npm install

# Instalar o NestJS globalmente com permissões adequadas
RUN npm install -g @nestjs/cli

# Verificar se o NestJS CLI foi instalado corretamente
RUN npm list -g --depth=0

# Ajustar permissões de nest no diretório global para evitar problemas
RUN chmod -R 777 /usr/local/lib/node_modules/@nestjs

# Copiar o restante do código para dentro do container
COPY . .

# Expor a porta do servidor NestJS
EXPOSE 8000

# Comando padrão para iniciar o servidor em modo desenvolvimento com npx
CMD ["npx", "nest", "start", "--watch"]