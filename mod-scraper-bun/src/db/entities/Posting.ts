import { Column, Entity, ManyToMany, TableInheritance } from "typeorm";
import { PrimaryGeneratedUuidV7Column } from "../columnDecorators.ts";
import { type UUID } from "node:crypto";
import type { ScrapableUrl } from "./ScrapableUrl.ts";

export enum PostingSource {
	TWHL = "TWHL",
	GAMEBANANA = "GAMEBANANA",
}

@Entity()
@TableInheritance({ column: "postingSource" })
export class Posting {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;

	@Column({
		enum: PostingSource,
		nullable: false,
		type: "enum",
	})
	postingSource!: PostingSource;

	@Column("integer")
	externalId!: number;

	@ManyToMany("ScrapableUrl", (scrapableUrl: ScrapableUrl) => scrapableUrl.allPostings)
	allScrapableUrls!: ScrapableUrl[];

	@ManyToMany("ScrapableUrl", (scrapableUrl: ScrapableUrl) => scrapableUrl.currentPostings)
	currentScrapableUrls!: ScrapableUrl[];

	@Column("character varying", {
		length: 40_000,
	})
	description!: string;

	@Column({
		type: "timestamp with time zone",
		utc: true,
	})
	externalCreationDate!: Date;

	@Column({
		type: "timestamp with time zone",
		utc: true,
	})
	externalUpdateDate!: Date;

	@Column({
		type: "timestamp with time zone",
		utc: true,
	})
	firstFetchedInfo!: Date;

	@Column("character varying", {
		default: null,
		length: 40_000,
		nullable: true,
	})
	ignoredErrors?: string | null | undefined;

	@Column({
		type: "timestamp with time zone",
		utc: true,
	})
	lastFetchedInfo!: Date;

	@Column("character varying", {
		length: 255,
	})
	name!: string;
}
