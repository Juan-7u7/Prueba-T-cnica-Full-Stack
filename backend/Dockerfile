FROM node:20-slim

# Instalar openssl para Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# No copiamos todo aquí porque queremos usar volúmenes para desarrollo
# Pero para la construcción de la imagen base, está bien
COPY . .

# Generar el cliente de Prisma si el esquema existe
RUN npx prisma generate || true

EXPOSE 3000

# Iniciar con ts-node-dev mediante npm run dev
CMD ["npm", "run", "dev"]
