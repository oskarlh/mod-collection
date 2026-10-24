// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig(
	{ files: ["src/"] },
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	eslintConfigPrettier,
	{
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			"@stylistic/quotes": [
				"error",
				"double",
				{
					avoidEscape: true,
				},
			],
			"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-invalid-void-type": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					ignoreUsingDeclarations: true,
					varsIgnorePattern: "^_",
				},
			],
		},
	},
);
