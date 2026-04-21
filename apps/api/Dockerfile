FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci

#COMPILE TYPESCRIPT TO JAVASCRIPT
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=apps/api

#INSTALL PRODUCTION DEPENDENCIES
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --omit=dev

#FINAL IMAGE
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 apiuser

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist

USER apiuser
EXPOSE 3001
CMD ["node", "dist/index.js"]
