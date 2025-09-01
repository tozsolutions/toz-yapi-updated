# Use official Node.js runtime as base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm for better package management
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 toz-yapi

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=toz-yapi:nodejs /app/dist ./dist
COPY --from=builder --chown=toz-yapi:nodejs /app/package.json ./
COPY --from=builder --chown=toz-yapi:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER toz-yapi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Start the application
CMD ["node", "dist/index.js"]