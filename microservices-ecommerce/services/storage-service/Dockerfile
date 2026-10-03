# =========================
# Stage 1: Dependencies
# =========================
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# =========================
# Stage 2: Runtime
# =========================
FROM node:22-alpine

WORKDIR /app

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

COPY --from=dependencies /app/node_modules ./node_modules

COPY src ./src
COPY package.json ./

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8004

CMD ["node", "src/server.js"]