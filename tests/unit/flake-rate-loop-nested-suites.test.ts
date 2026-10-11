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

/** Nested Playwright shape: top-level specs empty; failures live under suites[]. */
const NESTED_REPORT = {
  suites: [
    {
      title: 'smoke.spec.ts',
      file: 'tests/e2e/smoke.spec.ts',
      specs: [],
      suites: [
        {
          title: 'smoke',
          file: 'tests/e2e/smoke.spec.ts',
          specs: [
            {
              title: 'passes',
              ok: true,
              tests: [{ results: [{ status: 'passed', duration: 10 }] }],
            },
            {
              title: 'fails',
              ok: false,
              tests: [
                {
                  results: [
                    {
                      status: 'unexpected',
                      duration: 5,
                      error: { message: 'boom' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  stats: { expected: 1, unexpected: 1, flaky: 0, duration: 15 },
};

/** Flat top-level specs only (no nested suites) — must stay tracked. */
const TOP_LEVEL_ONLY_REPORT = {
  suites: [
    {
      title: 'flat.spec.ts',
      file: 'tests/e2e/flat.spec.ts',
      specs: [
        {
          title: 'flat fails',
          ok: false,
          tests: [
            {
              results: [
                {
                  status: 'failed',
                  duration: 3,
                  error: { message: 'flat boom' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  stats: { expected: 0, unexpected: 1, flaky: 0, duration: 3 },
};

describe('flake-rate e2e loop nested Playwright suites (q-mp-1052)', () => {
  it('records nested specs so failingTests is non-empty when unexpected>0', () => {
    const out = tempDir('flake-e2e-nested-out-');
    const bin = tempDir('flake-e2e-nested-bin-');
    writeFakePlaywrightNpx(bin, NESTED_REPORT);
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
      failingTests: Array<{ test: string; failures: number }>;
      runSummaries: Array<{ ok: boolean; failed?: number }>;
    };
    const md = readFileSync(join(out, 'e2e-summary.md'), 'utf8');

    expect(summary.runSummaries).toEqual([
      expect.objectContaining({
        runId: 'e2e-1',
        ok: false,
        passed: 1,
        failed: 1,
      }),
    ]);
    expect(summary.failingCount).toBe(1);
    expect(summary.failingTests).toEqual([
      expect.objectContaining({
        test: 'tests/e2e/smoke.spec.ts::fails',
        failures: 1,
      }),
    ]);
    expect(md).toMatch(/Tests with ≥1 failure/);
    expect(md).not.toMatch(/^_None_$/m);
    expect(md).toMatch(/smoke\.spec\.ts::fails/);
    expect(result.status).not.toBe(0);
  });

  it('still records top-level-only specs (no nested suites)', () => {
    const out = tempDir('flake-e2e-flat-out-');
    const bin = tempDir('flake-e2e-flat-bin-');
    writeFakePlaywrightNpx(bin, TOP_LEVEL_ONLY_REPORT);
    spawnSync(process.execPath, [E2E_LOOP, '--runs', '1', '--out', out], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    });
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      failingCount: number;
      failingTests: Array<{ test: string }>;
    };
    expect(summary.failingCount).toBe(1);
    expect(summary.failingTests[0]?.test).toBe(
      'tests/e2e/flat.spec.ts::flat fails'
    );
  });
});
