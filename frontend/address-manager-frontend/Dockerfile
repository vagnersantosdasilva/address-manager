# Estágio 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O Vite precisa das variáveis no momento do build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:stable-alpine
# Copia o build do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html
# Configuração básica para React Router (evita 404 ao dar refresh)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]