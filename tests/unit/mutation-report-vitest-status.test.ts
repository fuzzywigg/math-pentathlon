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
 * Also covers hex globs (q-mp-1273): overnight/burn patterns must not match
 * hex-a-gone suite basenames while still matching real hex-rules files.
 * Also covers ARITH string-concat skip for NoSubstitutionTemplateLiteral
 * (q-mp-1318), infra error excluded from score denom (q-mp-1319), and
 * demoted mutationTestGlobToRegExp (q-mp-1323 via anyMutationGlobMatchesBasename).
 * Leave games dedupe (#1365/1232) and Vitest classify (#1351/1217) alone.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import { classifyVitestRunResult } from '../../scripts/lib/mutation-report-vitest-status.mjs';
import {
  anyMutationGlobMatchesBasename,
  baselineAllowsMutantRuns,
  collectMutants,
  expandExistingTests,
  isExcludedMutationSuiteName,
  isStringConcatOperand,
  mutateGame,
  mutationScoreDenominator,
  scoreOf,
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

describe('testGlobsForGame hex vs hex-a-gone (q-mp-1273)', () => {
  const hexGlobs = testGlobsForGame('hex');

  it('uses hex-rules / hex-end-rules overnight+burn tokens (not loose hex-*rules*)', () => {
    expect(hexGlobs).toContain('tests/unit/overnight-wave*-hex-rules*.test.ts');
    expect(hexGlobs).toContain('tests/unit/burn-wave*-hex-rules*.test.ts');
    expect(hexGlobs).toContain(
      'tests/unit/overnight-wave*-hex-end-rules*.test.ts'
    );
    expect(hexGlobs).toContain('tests/unit/burn-wave*-hex-end-rules*.test.ts');
    expect(hexGlobs).not.toContain(
      'tests/unit/overnight-wave*-hex-*rules*.test.ts'
    );
    expect(hexGlobs).not.toContain('tests/unit/burn-wave*-hex*rules*.test.ts');
  });

  it('fixture basenames: hex-a-gone overnight/burn do not match; hex-rules do', () => {
    expect(
      anyMutationGlobMatchesBasename(
        hexGlobs,
        'overnight-wave54-hex-a-gone-rules-x.test.ts'
      )
    ).toBe(false);
    expect(
      anyMutationGlobMatchesBasename(
        hexGlobs,
        'burn-wave41-hex-a-gone-rules.test.ts'
      )
    ).toBe(false);
    expect(
      anyMutationGlobMatchesBasename(
        hexGlobs,
        'overnight-wave10-hex-rules-foo.test.ts'
      )
    ).toBe(true);
    expect(
      anyMutationGlobMatchesBasename(hexGlobs, 'burn-wave12-hex-rules.test.ts')
    ).toBe(true);
    expect(
      anyMutationGlobMatchesBasename(
        hexGlobs,
        'overnight-wave1-hex-end-rules.test.ts'
      )
    ).toBe(true);
    expect(anyMutationGlobMatchesBasename(hexGlobs, 'hex-rules.test.ts')).toBe(
      true
    );
    expect(
      anyMutationGlobMatchesBasename(hexGlobs, 'hex-a-gone-rules.test.ts')
    ).toBe(false);
  });

  it('live expand for hex keeps hex-rules and has zero hex-a-gone hits', () => {
    const tests = expandExistingTests(hexGlobs);
    expect(tests).toContain('tests/unit/hex-rules.test.ts');
    expect(tests.every((t) => !t.includes('hex-a-gone'))).toBe(true);
  });

  it('hex-a-gone globs still match hex-a-gone overnight/burn fixtures', () => {
    const hagGlobs = testGlobsForGame('hex-a-gone');
    expect(
      anyMutationGlobMatchesBasename(
        hagGlobs,
        'overnight-wave54-hex-a-gone-rules-x.test.ts'
      )
    ).toBe(true);
    expect(
      anyMutationGlobMatchesBasename(
        hagGlobs,
        'burn-wave41-hex-a-gone-rules.test.ts'
      )
    ).toBe(true);
    expect(
      anyMutationGlobMatchesBasename(hagGlobs, 'burn-wave12-hex-rules.test.ts')
    ).toBe(false);
  });
});

function firstPlusBinary(src: string) {
  const sf = ts.createSourceFile('t.ts', src, ts.ScriptTarget.Latest, true);
  let found: ts.BinaryExpression | null = null;
  const visit = (n: ts.Node) => {
    if (
      !found &&
      ts.isBinaryExpression(n) &&
      n.operatorToken.kind === ts.SyntaxKind.PlusToken
    ) {
      found = n;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (!found) throw new Error(`no PlusToken in: ${src}`);
  return found;
}

function arithPlusMutants(src: string) {
  return collectMutants(src, 'fixture.ts').filter(
    (m) => m.kind === 'Arithmetic' && m.description.includes('+ →')
  );
}

describe('ARITH PlusToken string-concat skip (q-mp-1318)', () => {
  it('treats NoSubstitutionTemplateLiteral like string literal for skip', () => {
    const noSub = firstPlusBinary('const x = `hi` + y;');
    expect(ts.isNoSubstitutionTemplateLiteral(noSub.left)).toBe(true);
    expect(isStringConcatOperand(noSub.left)).toBe(true);
    expect(
      isStringConcatOperand(firstPlusBinary('const x = "hi" + y;').left)
    ).toBe(true);
    expect(
      isStringConcatOperand(firstPlusBinary('const x = `h${1}` + y;').left)
    ).toBe(true);
    expect(
      isStringConcatOperand(firstPlusBinary('const x = 1 + 2;').left)
    ).toBe(false);
  });

  it('does not emit Arithmetic mutant for `hi` + expr (or string / template)', () => {
    expect(arithPlusMutants('export const a = `hi` + y;\n')).toEqual([]);
    expect(arithPlusMutants('export const a = "hi" + y;\n')).toEqual([]);
    expect(arithPlusMutants('export const a = `h${1}` + y;\n')).toEqual([]);
    expect(arithPlusMutants('export const a = y + `hi`;\n')).toEqual([]);
  });

  it('still mutates numeric +', () => {
    const mutants = arithPlusMutants('export const a = 1 + 2;\n');
    expect(mutants.length).toBeGreaterThan(0);
    expect(mutants[0]?.description).toMatch(/\+ → -/);
  });
});

describe('mutation score excludes infra error (q-mp-1319)', () => {
  it('scoreOf(8,10)=80; excluding error denom yields 88.9', () => {
    expect(scoreOf(8, 10)).toBe(80);
    expect(
      scoreOf(
        8,
        mutationScoreDenominator({
          killed: 8,
          survived: 1,
          timeout: 0,
          error: 1,
        })
      )
    ).toBe(88.9);
  });

  it('timeouts remain in the denominator (not-killed)', () => {
    expect(
      mutationScoreDenominator({
        killed: 8,
        survived: 0,
        timeout: 1,
        error: 1,
      })
    ).toBe(9);
    expect(
      scoreOf(
        8,
        mutationScoreDenominator({
          killed: 8,
          survived: 0,
          timeout: 1,
          error: 1,
        })
      )
    ).toBe(88.9);
  });

  it('mutateGame score ignores infra error outcomes', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'q-mp-1319-'));
    const rulesPath = path.join(tmpDir, 'rules.ts');
    fs.writeFileSync(rulesPath, FIXTURE_RULES);
    try {
      let n = 0;
      const mutants = [
        fakeMutant('m1', FIXTURE_RULES.replace('>', '>=')),
        fakeMutant('m2', FIXTURE_RULES.replace('>', '<')),
        fakeMutant('m3', FIXTURE_RULES.replace('>', '!==')),
      ];
      const result = mutateGame('demo', {
        max: 3,
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
              durationMs: 1,
              stdout: '',
              stderr: '',
            };
          }
          if (n === 2 || n === 3) {
            return {
              status: 'killed',
              exitCode: 1,
              durationMs: 2,
              stdout: 'FAIL',
              stderr: '',
            };
          }
          // third mutant → infra error
          return {
            status: 'error',
            exitCode: 1,
            durationMs: 3,
            stdout: '',
            stderr: 'spawn fail',
          };
        },
      });
      // baseline + 2 killed + 1 error → killed 2 / denom 2 = 100 (error excluded)
      expect(result.skipped).toBe(false);
      expect(result.killed).toBe(2);
      expect(result.error).toBe(1);
      expect(result.ranMutants).toBe(3);
      expect(result.score).toBe(100);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('mutationTestGlobToRegExp demoted (q-mp-1323)', () => {
  it('is not an own enumerable export of mutation-report.mjs', async () => {
    const mod = await import('../../scripts/mutation-report.mjs');
    expect(Object.hasOwn(mod, 'mutationTestGlobToRegExp')).toBe(false);
    expect(typeof mod.anyMutationGlobMatchesBasename).toBe('function');
  });
});
