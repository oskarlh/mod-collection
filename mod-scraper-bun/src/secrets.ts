import { readFileSync } from "node:fs";
import { env } from "node:process";

export const secrets: {
	twhlClientApiKey: string;
} = JSON.parse(
	readFileSync(env["MOD_SECRETS_FILE"] ?? "../modScraperSecrets.json", { encoding: "utf8" }),
);
