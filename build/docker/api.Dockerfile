FROM node:21-alpine3.17 as builder

ADD api /app

WORKDIR /app

# installing pnpm
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -; mv /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm
RUN pnpm config set store-dir /pnpm-store

ARG SKIPCACHE=1

RUN --mount=type=cache,id=ps,target=/pnpm-store \
  pnpm install && \
  pnpm prisma generate




FROM node:21-alpine3.17

COPY --from=builder /usr/local/bin/pnpm /usr/local/bin/pnpm

RUN apk update && apk add rsync curl

COPY --from=builder /api /app

EXPOSE 3001

WORKDIR /app/

ENTRYPOINT pnpm run start
