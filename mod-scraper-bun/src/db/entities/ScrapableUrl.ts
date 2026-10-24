import { Column, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { PrimaryGeneratedUuidV7Column, UrlColumn } from "../columnDecorators.ts";
import { type UUID } from "node:crypto";
import type { Posting } from "./Posting.ts";
import type { DownloadedFile } from "./DownloadedFile.ts";

@Entity()
export class ScrapableUrl {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;

	@Index({ unique: true })
	@UrlColumn()
	url!: URL;

	@ManyToMany("Posting", (posting: Posting) => posting.allScrapableUrls)
	allPostings!: Posting[];

	@ManyToMany("Posting", (posting: Posting) => posting.currentScrapableUrls)
	currentPostings!: Posting[];

	@ManyToOne(
		"DownloadedFile",
		(downloadedFile: DownloadedFile) => downloadedFile.scrapableUrlsForWhichThisIsTheLatestDownload,
		{
			nullable: true,
		},
	)
	latestDownloadedFile?: DownloadedFile | null | undefined;

	@Column({
		nullable: true,
		type: "timestamp with time zone",
		utc: true,
	})
	lastNotFoundTime?: Date | null | undefined;

	@Column({
		nullable: true,
		type: "timestamp with time zone",
		utc: true,
	})
	lastOtherErrorTime?: Date | null | undefined;

	@Column({
		nullable: true,
		type: "timestamp with time zone",
		utc: true,
	})
	lastSuccessTime?: Date | null | undefined;

	//	@Column("boolean")
	//	manuallyDisabled!: boolean;

	// Should be kept updated to match currentPostings.length
	@Column("integer")
	numCurrentPostings!: number;
}
