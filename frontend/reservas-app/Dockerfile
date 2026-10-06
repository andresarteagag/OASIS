# Etapa 1: Build de Angular
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --configuration=production

# Etapa 2: Servir con NGINX
FROM nginx:alpine

COPY --from=build /app/dist/reservas-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
