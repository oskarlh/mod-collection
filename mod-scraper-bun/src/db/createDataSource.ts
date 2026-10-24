import "reflect-metadata";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

export function createDataSource() {
	return new DataSource({
		database: process.env["PG_DATABASE"] ?? "postgres",
		entities: [fileURLToPath(import.meta.resolve("./entities/*.{js,ts}"))],
		host: process.env["PG_HOST"] ?? "localhost",
		logging: true,
		migrations: [fileURLToPath(import.meta.resolve("./migrations/*.{js,ts}"))],
		password: process.env["PG_PASSWORD"] ?? "password",
		port: Number(process.env["PG_PORT"] ?? 6222),
		type: "postgres",
		username: process.env["PG_USERNAME"] ?? "postgres",
	});
}
