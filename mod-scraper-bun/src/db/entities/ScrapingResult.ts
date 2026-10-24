import { Column, Entity, Index } from "typeorm";
import { PrimaryGeneratedUuidV7Column, UrlColumn } from "../columnDecorators.ts";
import { type UUID } from "node:crypto";

export enum ScrapingOutcome {
	BAD_ADDRESS = "BAD_ADDRESS",
	DOWNLOAD_ALREADY_IN_CACHE = "DOWNLOAD_ALREADY_IN_CACHE",
	NEW_DOWNLOAD = "NEW_DOWNLOAD",
	NOT_FOUND = "NOT_FOUND",
	OTHER_HTTP_ERROR = "OTHER_HTTP_ERROR",
}

@Entity()
export class ScrapingResult {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;

	@Column({
		enum: ScrapingOutcome,
		type: "enum",
	})
	outcome!: boolean;

	@Column({
		type: "timestamp with time zone",
		utc: true,
	})
	requestTime!: Date;

	@Index()
	@UrlColumn()
	url!: URL;
}
