FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production
RUN if [ -f dist/portfolio/browser/index.csr.html ]; then cp dist/portfolio/browser/index.csr.html dist/portfolio/browser/index.html; fi

FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80

