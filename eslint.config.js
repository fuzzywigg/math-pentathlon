import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/**
 * Lint ratchet (burn-1008-mp-lint-ratchet + q-mp-045 + q-mp-128):
 * - Hard errors: eqeqeq, prefer-const, curly (multi-line), no-implicit-coercion,
 *   consistent-type-imports, no-floating-promises, no-misused-promises,
 *   no-unused-vars (underscore ignore for args/vars/caught errors).
 * - Ceiling (report-only / count-down) via `npm run lint:ratchet`
 *   (see scripts/check-lint-ratchet.mjs + docs/dev/lint-ratchet-ceilings.json):
 *   curly "all"; @typescript-eslint/no-non-null-assertion (live unset);
 *   @typescript-eslint/no-confusing-void-expression (live unset).
 * - Inventory of other off/unset bug-catchers: docs/dev/eslint-off-rules-inventory.md
 * - AI modules: promise rules off (behavior-adjacent); type-import / style rules stay on.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      curly: ['error', 'multi-line'],
      'no-implicit-coercion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          // Keep `typeof import('…')` for lazy/dynamic module types.
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: [
      'src/**/ai.ts',
      'src/**/ai.worker.ts',
      'src/**/ai-client.ts',
      'src/**/ai/**/*.ts',
    ],
    rules: {
      // Avoid inviting behavior edits in search / difficulty / worker paths.
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      // Braces on single-line early returns in AI are noise; multi-line still covered
      // by the global rule when they span lines. Full curly:all is ceilinged separately.
      'no-implicit-coercion': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  }
);
