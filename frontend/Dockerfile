# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build -- --configuration production

# Runtime stage — serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/hms-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
