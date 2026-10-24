import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig([
	{
		input: "https://twhl.info/api", //"http://localhost:82/api", // "./twhl-api.json", //"https://twhl.info/api",
		output: {
			format: "prettier",
			importFileExtension: "ts",
			lint: "eslint",
			path: "src/services/twhl/generatedClient",
		},
		plugins: [
			//"@hey-api/typescript",
			{
				name: "@hey-api/client-fetch",
				throwOnError: true,
			},
			{
				dates: true,
				name: "@hey-api/transformers",
			},
			{
				auth: true,
				examples: true,
				name: "@hey-api/sdk",
				transformer: true,
				operations: {
					containerName: "TwhlApiClient",
					strategy: "single",
				},
			},
		],
	},
]);
