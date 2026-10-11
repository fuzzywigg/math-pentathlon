/**
 * @vitest-environment node
 *
 * Hermetic coverage for mutation-report mutateGame baseline gate (q-mp-1243):
 * `no-tests` baseline must skip mutants (score null / skipReason), same posture
 * as other baseline failures. Games with a surviving baseline still run mutants.
 * Leaves classifyVitest / argv integer tickets alone.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  baselineAllowsMutantRuns,
  mutateGame,
} from '../../scripts/mutation-report.mjs';

const FIXTURE_RULES = 'export function demo(n: number): boolean {\n  return n > 0;\n}\n';

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

