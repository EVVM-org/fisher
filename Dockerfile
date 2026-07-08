FROM oven/bun:1.3.14 AS builder
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install 

COPY . .

RUN bun run build

FROM oven/bun:1.3.14-slim 
WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV PORT=80

CMD ["bun", ".output/server/index.mjs"]
