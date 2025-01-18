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
 
COPY . .
 
EXPOSE 3000
 
CMD ["npm", "run", "dev"]
 