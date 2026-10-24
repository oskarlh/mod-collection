import type { DatabaseService } from "../DatabaseService.ts";

export class TwhlInfoService implements AsyncDisposable {
	private interval: Timer;
	constructor(private databaseService: DatabaseService) {
		this.interval = setInterval(() => {
			console.log("TWHL TEST");
		});
	}

	async [Symbol.asyncDispose](): Promise<void> {
		clearInterval(this.interval);
	}
}
