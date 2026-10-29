import js from "@eslint/js"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"
import tseslint from "typescript-eslint"

// No type-aware rules here: `tsc --noEmit` in the type-check script owns type checking.
export default tseslint.config(
  // No .js is ever linted: only the globs below are, and both are TypeScript.
  { ignores: ["dist", "eslint.config.js"] },
  {
    files: ["src/**/*.ts", "prisma/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
    plugins: { "simple-import-sort": simpleImportSort, "unused-imports": unusedImports },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Both autofix: the import rule deletes the import, the var rule only reports.
      "unused-imports/no-unused-imports": "error",
      // Replaces the typescript-eslint rule of the same job, which must be off
      // for this one to see anything. A leading underscore opts a name out.
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": [
        "error",
        { vars: "all", args: "after-used", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },
)
