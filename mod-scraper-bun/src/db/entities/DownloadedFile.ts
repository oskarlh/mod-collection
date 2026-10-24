import { Column, Entity, ManyToOne } from "typeorm";
import { PrimaryGeneratedUuidV7Column, UrlColumn } from "../columnDecorators.ts";
import { type UUID } from "node:crypto";
import type { ScrapableUrl } from "./ScrapableUrl.ts";

@Entity()
export class DownloadedFile {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;

	@Column("character varying", {
		length: 255,
		nullable: true,
	})
	contentType?: string | null | undefined;

	@Column("character varying", {
		length: 255,
	})
	etag!: string;

	@Column("character varying", {
		length: 255,
	})
	filePath!: string;

	@Column({
		nullable: true,
		type: "timestamp with time zone",
		utc: true,
	})
	lastModifiedDateInResponse?: Date | null | undefined;

	// File name from the Content-Disposition
	@Column("character varying", {
		length: 255,
	})
	originalFileName!: string;

	@ManyToOne("ScrapableUrl", (scrapableUrl: ScrapableUrl) => scrapableUrl.latestDownloadedFile)
	scrapableUrlsForWhichThisIsTheLatestDownload!: ScrapableUrl[];

	@UrlColumn({
		nullable: true,
	})
	url?: URL | null | undefined;
}
