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

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
