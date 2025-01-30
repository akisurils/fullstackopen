import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: { ...globals.node },
            ecmaVersion: "latest",
        },
    },
    {
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        rules: {
            "@stylistic/js/indent": ["error", 4],
            "@stylistic/js/linebreak-style": ["error", "windows"],
            "@stylistic/js/quotes": ["error", "double"],
            "@stylistic/js/semi": ["error", "always"],
        },
    },
    {
        ignores: ["dist/**"],
    },
];
