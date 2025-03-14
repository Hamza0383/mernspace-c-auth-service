tseslint.config.mjs;
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
export default [
    { ignores: ["dist/", "node_modules", "*.spec.ts", "test/"] },
    { files: ["src//*.{js,ts,jsx,tsx}", "tests//.{js,ts,jsx,tsx}"] },
    { files: ["**/.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["tests/*/.{js,ts,jsx,tsx}"],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs["flat/recommended"].rules,
            "jest/prefer-except-asserttions": "off",
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "no-console": "off",
        },
    },
    eslintPluginPrettierRecommended,
];
