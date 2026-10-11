/**
 * Vitest spawn status classification for scripts/mutation-report.mjs
 * (q-mp-1038, q-mp-1156, q-mp-1182). Kept free of TypeScript AST / spawn so
 * unit tests can import hermetically.
 */

/**
 * Vitest filter-miss / empty include — not a mutant kill.
 * Includes classic "No test files found" (1038), sibling Vitest phrases that
 * also mean zero matching files (1156), and short "No tests found" (1182).
 */
const NO_TEST_FILES_RE =
  /No test files found|Found 0 test files|filter matched no files|No tests found/i;

/**
 * Classify a finished Vitest spawn for mutation scoring.
 * Filter-miss / no-test phrases → error (not killed). Empty harness
 * `testFiles` remains `no-tests` in the caller (left to q-mp-1025).
 *
 * @param {{ exitCode: number|null, stdout?: string, stderr?: string, timedOut?: boolean }} result
 * @returns {'survived'|'killed'|'timeout'|'error'}
 */
export function classifyVitestRunResult(result) {
  if (result.timedOut) return 'timeout';
  if (result.exitCode === 0) return 'survived';
  const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (NO_TEST_FILES_RE.test(combined)) return 'error';
  return 'killed';
}
