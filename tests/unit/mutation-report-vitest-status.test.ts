/**
 * @vitest-environment node
 *
 * Hermetic coverage for mutation-report Vitest status classification (q-mp-1038).
 * Filter-miss / "No test files found" must score as error, not killed.
 * Empty harness testFiles → no-tests remains a separate path (q-mp-1025).
 */
import { describe, it, expect } from 'vitest';
import { classifyVitestRunResult } from '../../scripts/lib/mutation-report-vitest-status.mjs';

describe('classifyVitestRunResult (q-mp-1038)', () => {
  it('maps Vitest "No test files found" (exit 1) to error, not killed', () => {
    const status = classifyVitestRunResult({
      exitCode: 1,
      stdout: '\nNo test files found, exiting with code 1\n',
      stderr: '',
    });
    expect(status).toBe('error');
    expect(status).not.toBe('killed');
  });

  it('detects the phrase in stderr as well as stdout', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout: '',
        stderr: 'No test files found, exiting with code 1',
      })
    ).toBe('error');
  });

  it('keeps real assertion failures as killed', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout:
          'FAIL  tests/unit/example.test.ts > does math\nAssertionError: expected 1 to be 2\n',
        stderr: '',
      })
    ).toBe('killed');
  });

  it('maps exit 0 to survived and timeouts to timeout', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 0,
        stdout: '✓ tests/unit/example.test.ts',
        stderr: '',
      })
    ).toBe('survived');
    expect(
      classifyVitestRunResult({
        timedOut: true,
        exitCode: null,
        stdout: '',
        stderr: '',
      })
    ).toBe('timeout');
  });
});
