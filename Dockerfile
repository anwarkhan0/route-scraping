FROM node:18.18-alpine AS base

# Create user1 with sudo privileges
RUN adduser -r -g root && echo "root ALL=(ALL:ALL) ALL" >> /etc/sudoers.d/root

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "index.js"]