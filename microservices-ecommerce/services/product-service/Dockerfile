# =========================
# Stage 1: Build
# =========================
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./

RUN go mod download

COPY main.go ./

RUN CGO_ENABLED=0 GOOS=linux \
    go build -ldflags="-s -w" \
    -o product-service main.go


# =========================
# Stage 2: Runtime
# =========================
FROM alpine:3.22

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/product-service .

RUN chown appuser:appgroup /app/product-service

USER appuser

EXPOSE 8002

CMD ["./product-service"]