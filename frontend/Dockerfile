# Usar Node.js para desarrollo
FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de Vite (predeterminado 5173)
EXPOSE 5173

# Ejecutar servidor de desarrollo con --host para permitir conexiones externas
CMD ["npm", "run", "dev", "--", "--host"]
