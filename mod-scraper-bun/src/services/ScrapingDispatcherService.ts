import { PrimaryGeneratedColumn } from "typeorm";
import { PrimaryGeneratedUuidV7Column } from "../db/columnDecorators.ts";
import { type UUID } from "node:crypto";

("twhl.info/test/vaul:id");

type SiteHandler = {
	domain: string; // "twhl.info"'
	path: string; // '/vault/:id'
};

const twhlMapVaultId =
	Number(
		new URLPattern("http{s}?://{www.}?twhl.info:{80}?/vault/view/:id").exec(
			"https://twhl.info:80/vault/view/3?f=34",
		)?.pathname.groups["id"],
	) || undefined;

class VaultItem {
	@PrimaryGeneratedUuidV7Column()
	id!: UUID;
}

type SiteScraperResult =
	| {
			type: "file-downloaded";
	  }
	| {
			nextUrl: URL;
			type: "follow-url";
	  };

type SiteScraper = {
	canScrapeUrl(url: URL): boolean;
	scrape(url: URL): Promise<SiteScraperResult>;
};

type ScrapeResult =
	| {
			error: Error;
			type: "error";
	  }
	| {
			type: "file-downloaded";
	  }
	| {
			url: URL;
			type: "no-scraper-download-manually";
	  };

export class ScrapingDispatcherService implements AsyncDisposable {
	#scrapers: SiteScraper[] = [];

	registerScraper(scraper: SiteScraper) {
		this.#scrapers.push(scraper);
	}

	async scrape(url: URL): Promise<ScrapeResult> {
		let nextUrl = url;
		for (let numRequests = 1; numRequests < 10; ++numRequests) {
			const scraper = this.#scrapers.find((scr) => scr.canScrapeUrl(nextUrl));
			if (!scraper) {
				return {
					type: "no-scraper-download-manually",
					url: nextUrl,
				};
			}
			let res: SiteScraperResult;
			try {
				res = await scraper.scrape(nextUrl);
			} catch (error) {
				return {
					error: error instanceof Error ? error : new Error("Bad error type"),
					type: "error",
				};
			}
			if (res.type === "file-downloaded") {
				return res;
			}
			nextUrl = res.nextUrl;
		}
		return {
			error: new Error("Too many redirects"),
			type: "error",
		};
	}

	async [Symbol.asyncDispose](): Promise<void> {}
}
