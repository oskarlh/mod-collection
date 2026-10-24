FROM rust:latest AS builder
WORKDIR /app
COPY . .
RUN cargo install --path .


FROM ubuntu AS run-service
WORKDIR /app
COPY --from=builder /usr/local/cargo/bin/mod-scraper ./mod-scraper
CMD ["./mod-scraper"]
