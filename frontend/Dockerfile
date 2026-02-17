# Etapa 1: Build (Compilación)
FROM node:20-alpine AS build 
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .
RUN npm run build 

# Etapa 2: Serve (Producción con Nginx)
FROM nginx:alpine 
# Vite genera los archivos en '/dist'
COPY --from=build /app/dist /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"] 