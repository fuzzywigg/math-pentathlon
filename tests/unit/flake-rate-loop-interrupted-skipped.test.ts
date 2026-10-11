import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const E2E_LOOP = resolve(process.cwd(), 'scripts/flake-rate-e2e-loop.mjs');

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

/** Shell-escape a JSON string for embedding in a single-quoted printf. */
function shellSingleQuote(json: string): string {
  return json.replace(/'/g, "'\\''");
}

/**
 * Fake `npx` that prints Playwright-shaped reporter JSON to stdout
 * (matches flake-rate-e2e-loop capturing `result.stdout`).
 */
function writeFakePlaywrightNpx(binDir: string, payload: unknown): void {
  const scriptPath = join(binDir, 'npx');
  const body = shellSingleQuote(JSON.stringify(payload));
  writeFileSync(
    scriptPath,
    `#!/bin/sh
printf '%s' '${body}'
exit 1
`,
    { mode: 0o755 }
  );
  chmodSync(scriptPath, 0o755);
}

/** interrupted + skipped with stats.unexpected left at 0 (walk must count). */
const INTERRUPTED_SKIPPED_REPORT = {
  suites: [
    {
      title: 'abort.spec.ts',
      file: 'tests/e2e/abort.spec.ts',
      specs: [
        {
          title: 'worker died',
          ok: false,
          tests: [
            {
              results: [
                {
                  status: 'interrupted',
                  duration: 8,
                  error: { message: 'worker process gone' },
                },
              ],
            },
          ],
        },
        {
          title: 'not run today',
          ok: true,
          tests: [
            {
              results: [{ status: 'skipped', duration: 0 }],
            },
          ],
        },
        {
          title: 'still passes',
          ok: true,
          tests: [
            {
              status: 'expected',
              results: [{ status: 'passed', duration: 4 }],
            },
          ],
        },
      ],
    },
  ],
  // Root unexpected omits the interrupt so walkSuite is the source of truth.
  stats: { expected: 1, unexpected: 0, flaky: 0, skipped: 0, duration: 12 },
};

describe('flake-rate e2e loop counts interrupted and tracks skipped (q-mp-1218)', () => {
  it('counts interrupted as fail and tracks skipped without diluting pass/fail', () => {
    const out = tempDir('flake-e2e-interrupted-out-');
    const bin = tempDir('flake-e2e-interrupted-bin-');
    writeFakePlaywrightNpx(bin, INTERRUPTED_SKIPPED_REPORT);
    const result = spawnSync(
      process.execPath,
      [E2E_LOOP, '--runs', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      failingCount: number;
      failingTests: Array<{
        test: string;
        failures: number;
        flakes: number;
        runs: number;
      }>;
      runSummaries: Array<{
        ok: boolean;
        passed?: number;
        failed?: number;
        flaky?: number;
        skipped?: number;
      }>;
    };
    const md = readFileSync(join(out, 'e2e-summary.md'), 'utf8');

    expect(summary.runSummaries).toEqual([
      expect.objectContaining({
        runId: 'e2e-1',
        ok: false,
        passed: 1,
        failed: 1,
        flaky: 0,
        skipped: 1,
      }),
    ]);
    expect(summary.failingCount).toBe(1);
    expect(summary.failingTests).toEqual([
      expect.objectContaining({
        test: 'tests/e2e/abort.spec.ts::worker died',
        failures: 1,
        flakes: 0,
        runs: 1,
      }),
    ]);
    // Skipped-only specs must not appear as failures.
    expect(
      summary.failingTests.some((t) => t.test.includes('not run today'))
    ).toBe(false);
    expect(md).toMatch(/Skipped/);
    expect(md).toMatch(/abort\.spec\.ts::worker died/);
    expect(md).not.toMatch(/not run today/);
    expect(result.status).not.toBe(0);
  });

  it('keeps folded flaky counting (q-mp-1183 / #1343) distinct from interrupted', () => {
    const out = tempDir('flake-e2e-flaky-keep-out-');
    const bin = tempDir('flake-e2e-flaky-keep-bin-');
    writeFakePlaywrightNpx(bin, {
      suites: [
        {
          title: 'flaky.spec.ts',
          file: 'tests/e2e/flaky.spec.ts',
          specs: [
            {
              title: 'sometimes flakes',
              ok: false,
              tests: [
                {
                  results: [
                    {
                      status: 'flaky',
                      duration: 12,
                      error: { message: 'intermittent' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      stats: { expected: 0, unexpected: 0, flaky: 0, skipped: 0, duration: 12 },
    });
    spawnSync(process.execPath, [E2E_LOOP, '--runs', '1', '--out', out], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    });
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      failingTests: Array<{ failures: number; flakes: number }>;
      runSummaries: Array<{
        ok: boolean;
        failed?: number;
        flaky?: number;
        skipped?: number;
      }>;
    };
    expect(summary.runSummaries[0]).toEqual(
      expect.objectContaining({
        ok: false,
        failed: 0,
        flaky: 1,
        skipped: 0,
      })
    );
    expect(summary.failingTests[0]).toEqual(
      expect.objectContaining({ failures: 0, flakes: 1 })
    );
  });

  it('skipped-only runs stay ok:true (skips do not dilute pass/fail)', () => {
    const out = tempDir('flake-e2e-skipped-only-out-');
    const bin = tempDir('flake-e2e-skipped-only-bin-');
    writeFakePlaywrightNpx(bin, {
      suites: [
        {
          title: 'skip.spec.ts',
          file: 'tests/e2e/skip.spec.ts',
          specs: [
            {
              title: 'gated off',
              ok: true,
              tests: [{ results: [{ status: 'skipped', duration: 0 }] }],
            },
            {
              title: 'passes',
              ok: true,
              tests: [{ results: [{ status: 'passed', duration: 2 }] }],
            },
          ],
        },
      ],
      stats: { expected: 1, unexpected: 0, flaky: 0, skipped: 1, duration: 2 },
    });
    const result = spawnSync(
      process.execPath,
      [E2E_LOOP, '--runs', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      failingCount: number;
      runSummaries: Array<{
        ok: boolean;
        passed?: number;
        failed?: number;
        skipped?: number;
      }>;
    };
    expect(summary.runSummaries[0]).toEqual(
      expect.objectContaining({
        ok: true,
        passed: 1,
        failed: 0,
        skipped: 1,
      })
    );
    expect(summary.failingCount).toBe(0);
    expect(result.status).toBe(0);
  });
});
