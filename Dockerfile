FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --network-timeout=600000

COPY . .

EXPOSE 5173 5000