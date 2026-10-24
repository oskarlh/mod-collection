import {
	DataSource,
	EntityTarget,
	ObjectLiteral,
	QueryRunner,
	ReplicationMode,
	Repository,
} from "typeorm";
import { createDataSource } from "../db/createDataSource.ts";
import { createTestDataSource } from "../db/createTestDataSource.ts";

export class DatabaseService implements AsyncDisposable {
	constructor(public dataSource: DataSource) {}

	async connectQueryRunner(mode?: ReplicationMode): Promise<QueryRunner> {
		return this.dataSource.createQueryRunner(mode).connect();
	}

	createQueryRunner(mode?: ReplicationMode): QueryRunner {
		return this.dataSource.createQueryRunner(mode);
	}

	getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> {
		return this.dataSource.getRepository(entity);
	}

	async [Symbol.asyncDispose](): Promise<void> {
		await this.dataSource.destroy();
	}
}
export async function createDatabaseService(
	source: "regular" | "unit-tests",
): Promise<DatabaseService> {
	let dataSource: DataSource;
	if (source === "regular") {
		dataSource = createDataSource();
	} else {
		dataSource = createTestDataSource();
	}

	await dataSource.initialize();

	return new DatabaseService(dataSource);
}
