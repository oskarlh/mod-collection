import "reflect-metadata";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

export function createTestDataSource() {
	return new DataSource({
		database: process.env["TEST_PG_DATABASE"] ?? "mod-scraper-unit-test-db",
		entities: [fileURLToPath(import.meta.resolve("./entities/*.ts"))],
		host: process.env["TEST_PG_HOST"] ?? "localhost",
		logging: true,
		migrations: [fileURLToPath(import.meta.resolve("./migrations/*.ts"))],
		password: process.env["TEST_PG_PASSWORD"] ?? "mod-scraper-unit-test-db-password",
		port: Number(process.env["TEST_PG_HOST"] ?? 6223),
		type: "postgres",
		username: process.env["TEST_PG_USERNAME"] ?? "mod-scraper-unit-test-db-user",
	});
}
