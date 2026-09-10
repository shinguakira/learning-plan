import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// No type-aware rules here: `tsc -b` in the build script owns type checking.
export default tseslint.config(
  // No .js is ever linted: only the globs below are, and both are TypeScript.
  { ignores: ['dist', 'eslint.config.js'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // v7 keeps the eslintrc-format configs at the top level; the flat ones
      // live under `.flat`, so this is not configs['recommended-latest'].
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    // shadcn components export their cva variants alongside the component by
    // design, which the react-refresh rule cannot allow for. These files are
    // vendored library source, so the rule is off for them and them only.
    files: ['src/components/ui/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['vite.config.ts', 'playwright.config.ts', 'test/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
)
