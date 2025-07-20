# Stage 1: install deps
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
# or use npm install if not using pnpm
RUN npm ci

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
# create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
