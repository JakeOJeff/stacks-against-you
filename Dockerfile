# Stage 1: dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app

# ✅ Disable ESLint during production build
ENV NEXT_DISABLE_ESLINT=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# ✅ Install ts-node and typescript globally
RUN npm install -g ts-node typescript

# ✅ Copy built app and source files
COPY --from=builder /app ./

# ✅ Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

EXPOSE 3000

# ✅ Start server using ts-node and ES module loader
CMD ["node", "--loader", "ts-node/esm", "server.mts"]
