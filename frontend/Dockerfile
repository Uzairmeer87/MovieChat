# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for cache layer
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Pass in env variables available at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build for production
RUN npm run build

# Stage 2: Serve the app via Nginx
FROM nginx:alpine

# Default BACKEND_URL fallback so envsubst never encounters an unexpanded variable
ENV BACKEND_URL=http://backend:5000

# Copy entrypoint scripts (e.g. BACKEND_URL sanitizer)
COPY docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.envsh 2>/dev/null || true

# Copy custom Nginx configuration to templates directory to enable envsubst
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy build artifacts to nginx root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
