import { createDatabaseService } from "./services/DatabaseService.ts";

function activateShutdownDeadline(deadline: number) {
	setTimeout(() => {
		console.error(
			"Process killed after waiting for shut down callbacks to finish for %f seconds.",
			deadline,
		);
		process.kill(process.pid, "SIGINT");
	}, deadline * 1_000).unref();
}

async function awaitSigint(): Promise<void> {
	await new Promise<void>((resolve) => {
		process.once("SIGINT", resolve);
	});
}

const SHUTDOWN_TIMEOUT_SECONDS = 3 * 60;

async function main() {
	await using db = await createDatabaseService("regular");
	await using config = await Config.load();

	const scrapeScheduleStream = schedule("every 5min").pipeTo(() => {
		

	}).pipeThrough(debounce("1.1sec")).pipeThrough(() => {
		fetchVaultPages(49)
	}).pipeTo(savePages);
	const 

	const stream = set up stream here.


	await Promise.any([awaitSigint(),
		(async () => {
			set up streams here

		})
	]);
	activateShutdownDeadline(SHUTDOWN_TIMEOUT_SECONDS);

	stream.cancel();
}

await main();
