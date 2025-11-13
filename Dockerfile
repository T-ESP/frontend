# ---------------------------------------
# STAGE 1 : Build Vite application
# ---------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# ---------------------------------------
# STAGE 2 : Serve with Nginx
# ---------------------------------------
FROM nginx:alpine

# Remove default nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to replace default nginx contents
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx optimized configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]