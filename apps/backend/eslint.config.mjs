import js from "@eslint/js"
import tseslint from "typescript-eslint"
import { globalIgnores } from "eslint/config"

export default tseslint.config([
  globalIgnores(["dist", "coverage"]),
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        Buffer: "readonly",
        console: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        module: "readonly",
        process: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
])
