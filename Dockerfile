# Stage 1: install deps
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps


# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install required runtime tools
RUN apk add --no-cache git

# Add ts-node and typescript globally
RUN npm install -g ts-node typescript

# Copy everything from builder
COPY --from=builder /app ./

# Run as non-root
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

EXPOSE 3000

CMD ["ts-node", "--loader", "ts-node/esm", "server.mts"]
