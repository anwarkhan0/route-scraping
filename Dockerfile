FROM node:18.18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["npx", "install", "playwright", "&&","node", "index.js"]