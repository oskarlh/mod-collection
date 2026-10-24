FROM oven/bun:latest AS common-base
WORKDIR /app
COPY bun.lock package.json tsconfig.json ./
RUN bun install --production --frozen-lockfile


FROM common-base AS dev-base
ENV NODE_ENV="development"
RUN bun install --frozen-lockfile
COPY src ./src

FROM dev-base AS check-formatting
COPY .prettierrc ./.prettierrc
CMD ["bun", "run", "check-formatting"]

FROM dev-base AS lint
COPY eslint.config.mjs ./eslint.config.mjs
CMD ["bun", "run", "lint"]

FROM dev-base AS test
CMD ["bun", "test"]

FROM dev-base AS run-dev
ENTRYPOINT ["bun", "run", "start"]

FROM dev-base AS run-watch
ENTRYPOINT ["bun", "run", "watch"]


FROM common-base AS run-service
ENV NODE_ENV="production"
COPY src ./src
ENTRYPOINT ["bun", "run", "start"]
