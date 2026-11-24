# Angular 21: compila la SPA en una imagen Node y sirve los estaticos con Nginx.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production
RUN test -f /app/dist/frontend-angular/browser/index.html

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend-angular/browser/ /usr/share/nginx/html/
EXPOSE 8080
