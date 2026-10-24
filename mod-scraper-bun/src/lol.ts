import { TwhlClientService } from "./services/twhl/TwhlClientService.ts";
const t = new TwhlClientService();

console.log(
	await t.getNewOrUpdatedVaultItems(40, Temporal.Instant.from("2026-05-31T20:19:34.154Z")),
);
