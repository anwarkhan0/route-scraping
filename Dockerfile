FROM node:18.18-alpine AS base

RUN apk add --no-cache --update su sudo


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