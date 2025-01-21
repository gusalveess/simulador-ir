FROM node

WORKDIR /workspace/frontend

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    build-essential \
    g++ \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]