import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1767904352900 implements MigrationInterface {
	name = "InitDb1767904352900";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			"CREATE TYPE \"public\".\"posting_postingsource_enum\" AS ENUM('TWHL', 'GAMEBANANA')",
		);
		await queryRunner.query(
			'CREATE TABLE "posting" ("id" uuid NOT NULL DEFAULT uuidv7(), "postingSource" "public"."posting_postingsource_enum" NOT NULL, "externalId" integer NOT NULL, "description" character varying(40000) NOT NULL, "externalCreationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "externalUpdateDate" TIMESTAMP WITH TIME ZONE NOT NULL, "firstFetchedInfo" TIMESTAMP WITH TIME ZONE NOT NULL, "ignoredErrors" character varying(40000), "lastFetchedInfo" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying(255) NOT NULL, "creatorTwhlUserId" uuid NOT NULL, CONSTRAINT "PK_b535363e80b08416dacf34303a9" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_58ae7250a9753fb81254500283" ON "posting" ("postingSource") ',
		);
		await queryRunner.query(
			'CREATE TABLE "scrapable_url" ("id" uuid NOT NULL DEFAULT uuidv7(), "url" character varying(8000) NOT NULL, "lastNotFoundTime" TIMESTAMP WITH TIME ZONE, "lastOtherErrorTime" TIMESTAMP WITH TIME ZONE, "lastSuccessTime" TIMESTAMP WITH TIME ZONE, "numCurrentPostings" integer NOT NULL, "latestDownloadedFileId" uuid, CONSTRAINT "PK_64a7b9a41d8e9d051a05a605d0f" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE UNIQUE INDEX "IDX_9638885926f0ac57b0aa2d482a" ON "scrapable_url" ("url") ',
		);
		await queryRunner.query(
			'CREATE TABLE "twhl_user" ("id" uuid NOT NULL DEFAULT uuidv7(), "externalId" integer NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_e4fdc57c5b72b0225ce0970a815" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE UNIQUE INDEX "IDX_0b190477bf2d3c335f2a6ead7a" ON "twhl_user" ("externalId") ',
		);
		await queryRunner.query(
			'CREATE TABLE "downloaded_file" ("id" uuid NOT NULL DEFAULT uuidv7(), "contentType" character varying(255), "etag" character varying(255) NOT NULL, "filePath" character varying(255) NOT NULL, "lastModifiedDateInResponse" TIMESTAMP WITH TIME ZONE, "originalFileName" character varying(255) NOT NULL, "url" character varying(8000), "scrapableUrlsForWhichThisIsTheLatestDownloadId" uuid, CONSTRAINT "PK_d53bf78baf128b772d5d4633e4a" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			"CREATE TYPE \"public\".\"scraping_result_outcome_enum\" AS ENUM('BAD_ADDRESS', 'DOWNLOAD_ALREADY_IN_CACHE', 'NEW_DOWNLOAD', 'NOT_FOUND', 'OTHER_HTTP_ERROR')",
		);
		await queryRunner.query(
			'CREATE TABLE "scraping_result" ("id" uuid NOT NULL DEFAULT uuidv7(), "outcome" "public"."scraping_result_outcome_enum" NOT NULL, "requestTime" TIMESTAMP WITH TIME ZONE NOT NULL, "url" character varying(8000) NOT NULL, CONSTRAINT "PK_9b3326cd79461a5f63aa0c3839b" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_195c97605086123e8e5ea67c34" ON "scraping_result" ("url") ',
		);
		await queryRunner.query(
			'ALTER TABLE "posting" ADD CONSTRAINT "FK_e3f7425ef93f038aecbcf4aeb37" FOREIGN KEY ("creatorTwhlUserId") REFERENCES "twhl_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "scrapable_url" ADD CONSTRAINT "FK_eb04011d54845e4f33f85bcd1d0" FOREIGN KEY ("latestDownloadedFileId") REFERENCES "downloaded_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "downloaded_file" ADD CONSTRAINT "FK_44a806e5588a483dc5a0ee0ea57" FOREIGN KEY ("scrapableUrlsForWhichThisIsTheLatestDownloadId") REFERENCES "scrapable_url"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "downloaded_file" DROP CONSTRAINT "FK_44a806e5588a483dc5a0ee0ea57"',
		);
		await queryRunner.query(
			'ALTER TABLE "scrapable_url" DROP CONSTRAINT "FK_eb04011d54845e4f33f85bcd1d0"',
		);
		await queryRunner.query(
			'ALTER TABLE "posting" DROP CONSTRAINT "FK_e3f7425ef93f038aecbcf4aeb37"',
		);
		await queryRunner.query('DROP INDEX "public"."IDX_195c97605086123e8e5ea67c34"');
		await queryRunner.query('DROP TABLE "scraping_result"');
		await queryRunner.query('DROP TYPE "public"."scraping_result_outcome_enum"');
		await queryRunner.query('DROP TABLE "downloaded_file"');
		await queryRunner.query('DROP INDEX "public"."IDX_0b190477bf2d3c335f2a6ead7a"');
		await queryRunner.query('DROP TABLE "twhl_user"');
		await queryRunner.query('DROP INDEX "public"."IDX_9638885926f0ac57b0aa2d482a"');
		await queryRunner.query('DROP TABLE "scrapable_url"');
		await queryRunner.query('DROP INDEX "public"."IDX_58ae7250a9753fb81254500283"');
		await queryRunner.query('DROP TABLE "posting"');
		await queryRunner.query('DROP TYPE "public"."posting_postingsource_enum"');
	}
}
