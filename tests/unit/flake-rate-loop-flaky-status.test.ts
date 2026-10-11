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

/** Per-result status "flaky" with stats.flaky left at 0 (walk must count). */
const FLAKY_RESULT_REPORT = {
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
              status: 'flaky',
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
        {
          title: 'always passes',
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
  // Root stats omit the flake so walkSuite is the only source of truth.
  stats: { expected: 1, unexpected: 0, flaky: 0, duration: 16 },
};

describe('flake-rate e2e loop counts Playwright flaky results (q-mp-1183)', () => {
  it('increments flake counters and marks ok:false for status flaky', () => {
    const out = tempDir('flake-e2e-flaky-out-');
    const bin = tempDir('flake-e2e-flaky-bin-');
    writeFakePlaywrightNpx(bin, FLAKY_RESULT_REPORT);
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
      }>;
      runSummaries: Array<{
        ok: boolean;
        passed?: number;
        failed?: number;
        flaky?: number;
      }>;
    };
    const md = readFileSync(join(out, 'e2e-summary.md'), 'utf8');

    expect(summary.runSummaries).toEqual([
      expect.objectContaining({
        runId: 'e2e-1',
        ok: false,
        passed: 1,
        failed: 0,
        flaky: 1,
      }),
    ]);
    expect(summary.failingCount).toBe(1);
    expect(summary.failingTests).toEqual([
      expect.objectContaining({
        test: 'tests/e2e/flaky.spec.ts::sometimes flakes',
        failures: 0,
        flakes: 1,
      }),
    ]);
    expect(md).toMatch(/Flakes/);
    expect(md).toMatch(/flaky\.spec\.ts::sometimes flakes/);
    expect(result.status).not.toBe(0);
  });

  it('still treats hard failures without conflating them as flakes', () => {
    const out = tempDir('flake-e2e-fail-only-out-');
    const bin = tempDir('flake-e2e-fail-only-bin-');
    writeFakePlaywrightNpx(bin, {
      suites: [
        {
          title: 'hard.spec.ts',
          file: 'tests/e2e/hard.spec.ts',
          specs: [
            {
              title: 'hard fail',
              ok: false,
              tests: [
                {
                  results: [
                    {
                      status: 'failed',
                      duration: 2,
                      error: { message: 'hard boom' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      stats: { expected: 0, unexpected: 1, flaky: 0, duration: 2 },
    });
    spawnSync(process.execPath, [E2E_LOOP, '--runs', '1', '--out', out], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    });
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      failingTests: Array<{ failures: number; flakes: number }>;
      runSummaries: Array<{ ok: boolean; flaky?: number }>;
    };
    expect(summary.runSummaries[0]).toEqual(
      expect.objectContaining({ ok: false, flaky: 0 })
    );
    expect(summary.failingTests[0]).toEqual(
      expect.objectContaining({ failures: 1, flakes: 0 })
    );
  });
});
