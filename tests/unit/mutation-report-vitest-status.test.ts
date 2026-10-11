/**
 * @vitest-environment node
 *
 * Hermetic coverage for mutation-report Vitest status classification
 * (q-mp-1038, q-mp-1156, q-mp-1182, q-mp-1205). Filter-miss / no-test phrases
 * must score as error, not killed. Non-timeout exitCode null → error
 * (q-mp-1205). Empty harness testFiles → no-tests remains a separate path
 * (q-mp-1025).
 *
 * Also covers mutateGame baseline gate (q-mp-1243): `no-tests` baseline must
 * skip mutants (score null / skipReason). Kept in this unit-node file so the
 * suite stays off unit-shared jsdom setup without editing vitest.config.ts.
 *
 * Also covers frac-fact test globs (q-mp-1264): expandExistingTests must drop
 * *difficulty* overnight suites while keeping other wave54 rules files.
 * Leave games dedupe (#1365/1232) and Vitest classify (#1351/1217) alone.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { classifyVitestRunResult } from '../../scripts/lib/mutation-report-vitest-status.mjs';
import {
  baselineAllowsMutantRuns,
  expandExistingTests,
  isExcludedMutationSuiteName,
  mutateGame,
  testGlobsForGame,
} from '../../scripts/mutation-report.mjs';

describe('classifyVitestRunResult (q-mp-1038, q-mp-1156, q-mp-1182, q-mp-1205)', () => {
  it('maps Vitest "No test files found" (exit 1) to error, not killed', () => {
    const status = classifyVitestRunResult({
      exitCode: 1,
      stdout: '\nNo test files found, exiting with code 1\n',
      stderr: '',
    });
    expect(status).toBe('error');
    expect(status).not.toBe('killed');
  });

  it('maps "Found 0 test files" to error, not killed (q-mp-1156)', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout: 'Found 0 test files\n',
        stderr: '',
      })
    ).toBe('error');
  });

  it('maps "filter matched no files" to error, not killed (q-mp-1156)', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout: '',
        stderr: 'filter matched no files\n',
      })
    ).toBe('error');
  });

  it('maps "No tests found" to error, not killed (q-mp-1182)', () => {
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout: 'No tests found\n',
        stderr: '',
      })
    ).toBe('error');
    expect(
      classifyVitestRunResult({
        exitCode: 1,
        stdout: '',
        stderr: 'No tests found\n',
      })
    ).toBe('error');
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

  it('maps non-timeout exitCode null to error, not killed (q-mp-1205)', () => {
    expect(
      classifyVitestRunResult({
        exitCode: null,
        stdout: '',
        stderr: 'spawn ENOENT',
      })
    ).toBe('error');
    expect(
      classifyVitestRunResult({
        exitCode: null,
        stdout: '',
        stderr: '',
      })
    ).toBe('error');
  });

  it('keeps timedOut ahead of null exitCode (q-mp-1205)', () => {
    expect(
      classifyVitestRunResult({
        timedOut: true,
        exitCode: null,
        stdout: '',
        stderr: 'spawn ENOENT',
      })
    ).toBe('timeout');
  });
});

const FIXTURE_RULES =
  'export function demo(n: number): boolean {\n  return n > 0;\n}\n';

function fakeMutant(id: string, text: string) {
  return {
    id,
    kind: 'ComparisonFlip',
    line: 2,
    description: `${id} flip`,
    text,
  };
}

describe('baselineAllowsMutantRuns (q-mp-1243)', () => {
  it('allows only survived', () => {
    expect(baselineAllowsMutantRuns('survived')).toBe(true);
    expect(baselineAllowsMutantRuns('no-tests')).toBe(false);
    expect(baselineAllowsMutantRuns('killed')).toBe(false);
    expect(baselineAllowsMutantRuns('error')).toBe(false);
    expect(baselineAllowsMutantRuns('timeout')).toBe(false);
  });
});

describe('mutateGame baseline no-tests skip (q-mp-1243)', () => {
  let tmpDir: string;
  let rulesPath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'q-mp-1243-'));
    rulesPath = path.join(tmpDir, 'rules.ts');
    fs.writeFileSync(rulesPath, FIXTURE_RULES);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('skips mutants when baseline is no-tests (score null, no mutant runs)', () => {
    const runCalls: Array<{ files: string[] }> = [];
    const mutants = [
      fakeMutant('m1', FIXTURE_RULES.replace('>', '>=')),
      fakeMutant('m2', FIXTURE_RULES.replace('>', '<')),
    ];

    const result = mutateGame('demo', {
      max: 2,
      timeoutMs: 1_000,
      quietTests: true,
      rulesPath,
      tests: [],
      mutants,
      runVitest: (files) => {
        runCalls.push({ files });
        return {
          status: 'no-tests',
          exitCode: 0,
          durationMs: 0,
          stdout: '',
          stderr: 'no test files',
        };
      },
    });

    expect(result.skipped).toBe(true);
    expect(result.score).toBeNull();
    expect(result.skipReason).toBe('baseline no-tests');
    expect(result.ranMutants).toBe(0);
    expect(result.error).toBe(0);
    expect(result.survivors).toEqual([]);
    expect(runCalls).toHaveLength(1);
    expect(fs.readFileSync(rulesPath, 'utf8')).toBe(FIXTURE_RULES);
  });

  it('skips mutants on other non-survived baselines (same posture)', () => {
    const result = mutateGame('demo', {
      max: 1,
      timeoutMs: 1_000,
      quietTests: true,
      rulesPath,
      tests: ['tests/unit/fake.test.ts'],
      mutants: [fakeMutant('m1', FIXTURE_RULES.replace('>', '>='))],
      runVitest: () => ({
        status: 'error',
        exitCode: 1,
        durationMs: 5,
        stdout: '',
        stderr: 'spawn fail',
      }),
    });

    expect(result.skipped).toBe(true);
    expect(result.score).toBeNull();
    expect(result.skipReason).toBe('baseline error');
    expect(result.ranMutants).toBe(0);
  });

  it('runs mutants when baseline survived (games with tests unchanged)', () => {
    let n = 0;
    const mutants = [
      fakeMutant('m1', FIXTURE_RULES.replace('>', '>=')),
      fakeMutant('m2', FIXTURE_RULES.replace('>', '<')),
    ];

    const result = mutateGame('demo', {
      max: 2,
      timeoutMs: 1_000,
      quietTests: true,
      rulesPath,
      tests: ['tests/unit/fake.test.ts'],
      mutants,
      runVitest: () => {
        n += 1;
        if (n === 1) {
          return {
            status: 'survived',
            exitCode: 0,
            durationMs: 10,
            stdout: '',
            stderr: '',
          };
        }
        return {
          status: 'killed',
          exitCode: 1,
          durationMs: 12,
          stdout: 'FAIL',
          stderr: '',
        };
      },
    });

    expect(result.skipped).toBe(false);
    expect(result.ranMutants).toBe(2);
    expect(result.killed).toBe(2);
    expect(result.error).toBe(0);
    expect(result.score).toBe(100);
    expect(n).toBe(3);
    expect(fs.readFileSync(rulesPath, 'utf8')).toBe(FIXTURE_RULES);
  });
});

describe('testGlobsForGame / expandExistingTests (q-mp-1264)', () => {
  it('marks difficulty / scoring / ai suite basenames as excluded', () => {
    expect(
      isExcludedMutationSuiteName(
        'tests/unit/overnight-wave54-frac-rules-difficulty-operand-denoms.test.ts'
      )
    ).toBe(true);
    expect(
      isExcludedMutationSuiteName('tests/unit/some-game-scoring-rules.test.ts')
    ).toBe(true);
    expect(
      isExcludedMutationSuiteName(
        'tests/unit/overnight-wave1-hex-ai-rules.test.ts'
      )
    ).toBe(true);
    expect(
      isExcludedMutationSuiteName(
        'tests/unit/overnight-wave54-frac-rules-subtract-operand-order.test.ts'
      )
    ).toBe(false);
  });

  it('frac-fact globs include wave54 frac-rules wildcard', () => {
    const globs = testGlobsForGame('frac-fact');
    expect(globs).toContain('tests/unit/overnight-wave54-frac-rules-*.test.ts');
  });

  it('frac-fact expanded tests exclude difficulty overnight and keep other wave54 rules', () => {
    const tests = expandExistingTests(testGlobsForGame('frac-fact'));
    const wave54 = tests.filter((t) =>
      t.includes('overnight-wave54-frac-rules-')
    );
    expect(wave54.length).toBeGreaterThanOrEqual(3);
    expect(wave54.every((t) => !t.toLowerCase().includes('difficulty'))).toBe(
      true
    );
    expect(wave54).toContain(
      'tests/unit/overnight-wave54-frac-rules-subtract-operand-order.test.ts'
    );
    expect(wave54).toContain(
      'tests/unit/overnight-wave54-frac-rules-next-overshoot-clears.test.ts'
    );
    expect(wave54).toContain(
      'tests/unit/overnight-wave54-frac-rules-start-does-not-mutate.test.ts'
    );
    expect(wave54).not.toContain(
      'tests/unit/overnight-wave54-frac-rules-difficulty-operand-denoms.test.ts'
    );
  });
});
