FROM node:18.18-alpine AS base

RUN apk add --no-cache --update su sudo

RUN adduser -r -m root
RUN usermod -aG sudo root

# Use Google's DNS servers as an example
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf



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