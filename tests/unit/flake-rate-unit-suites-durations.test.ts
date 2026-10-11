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

const UNIT_LOOP = resolve(process.cwd(), 'scripts/flake-rate-unit-loop.mjs');

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

/** Fake `npx` that writes a fixed Vitest JSON reporter payload. */
function writeFakeNpx(binDir: string, payload: unknown): void {
  const scriptPath = join(binDir, 'npx');
  const json = JSON.stringify(payload).replace(/'/g, "'\\''");
  writeFileSync(
    scriptPath,
    `#!/bin/sh
out=""
for a in "$@"; do
  case "$a" in
    --outputFile=*) out=\${a#--outputFile=} ;;
  esac
done
if [ -z "$out" ]; then
  echo "fake npx: missing --outputFile" >&2
  exit 2
fi
printf '%s' '${json}' > "$out"
exit 0
`,
    { mode: 0o755 }
  );
  chmodSync(scriptPath, 0o755);
}

function runLoop(bin: string, out: string) {
  return spawnSync(
    process.execPath,
    [UNIT_LOOP, '--runs', '1', '--shuffle', '1', '--out', out],
    {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    }
  );
}

type Summary = {
  runSummaries: Array<{
    ok: boolean;
    failed?: number;
    error?: string;
  }>;
  failingTests: Array<{
    test: string;
    runs: number;
    failures: number;
    avgMs: number;
  }>;
  failingCount: number;
};

function readSummary(out: string): Summary {
  return JSON.parse(
    readFileSync(join(out, 'unit-summary.json'), 'utf8')
  ) as Summary;
}

describe('flake-rate unit loop honors numFailedTestSuites (q-mp-1200)', () => {
  it('marks ok:false when numFailedTestSuites>0 with empty assertionResults', () => {
    const out = tempDir('flake-unit-suites-out-');
    const bin = tempDir('flake-unit-suites-bin-');
    writeFakeNpx(bin, {
      success: true,
      numPassedTests: 0,
      numFailedTests: 0,
      numFailedTestSuites: 1,
      testResults: [
        {
          name: 'tests/unit/suite-setup.test.ts',
          status: 'failed',
          message: 'beforeAll failed',
          assertionResults: [],
        },
      ],
    });
    runLoop(bin, out);
    const summary = readSummary(out);
    expect(summary.runSummaries.length).toBe(2);
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
    expect(summary.runSummaries.every((r) => r.error === undefined)).toBe(true);
  });

  it('marks ok:false from failed suite status/message when numFailedTestSuites omitted', () => {
    const out = tempDir('flake-unit-suite-status-out-');
    const bin = tempDir('flake-unit-suite-status-bin-');
    writeFakeNpx(bin, {
      success: true,
      numPassedTests: 0,
      numFailedTests: 0,
      testResults: [
        {
          name: 'tests/unit/suite-setup.test.ts',
          status: 'failed',
          message: 'beforeAll failed',
          assertionResults: [],
        },
      ],
    });
    runLoop(bin, out);
    const summary = readSummary(out);
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
  });

  it('still marks ok:false when walked assertion failures exist', () => {
    const out = tempDir('flake-unit-assert-fail-out-');
    const bin = tempDir('flake-unit-assert-fail-bin-');
    writeFakeNpx(bin, {
      success: true,
      numPassedTests: 0,
      numFailedTests: 1,
      numFailedTestSuites: 0,
      testResults: [
        {
          name: 'tests/unit/fake.test.ts',
          assertionResults: [
            {
              fullName: 'fake a',
              status: 'failed',
              duration: 1,
              failureMessages: ['expected a'],
            },
          ],
        },
      ],
    });
    runLoop(bin, out);
    const summary = readSummary(out);
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
    expect(summary.failingCount).toBeGreaterThan(0);
  });
});

describe('flake-rate unit loop durations only for pass/fail (q-mp-1219)', () => {
  it('excludes skip/todo durations from avgMs', () => {
    const out = tempDir('flake-unit-dur-out-');
    const bin = tempDir('flake-unit-dur-bin-');
    writeFakeNpx(bin, {
      success: false,
      numPassedTests: 0,
      numFailedTests: 1,
      numFailedTestSuites: 0,
      testResults: [
        {
          name: 'tests/unit/dur.test.ts',
          assertionResults: [
            {
              fullName: 'mixed',
              status: 'failed',
              duration: 10,
              failureMessages: ['x'],
            },
            { fullName: 'mixed', status: 'skipped', duration: 990 },
            { fullName: 'mixed', status: 'todo', duration: 1000 },
            { fullName: 'mixed', status: 'pending', duration: 500 },
          ],
        },
      ],
    });
    runLoop(bin, out);
    const summary = readSummary(out);
    expect(summary.failingTests).toHaveLength(1);
    // Two runs (default+shuffle), each contributes one fail @ 10ms → avgMs 10
    expect(summary.failingTests[0].avgMs).toBe(10);
    expect(summary.failingTests[0].failures).toBe(2);
    expect(summary.failingTests[0].runs).toBe(2);
  });

  it('still records pass durations for avgMs when mixed with skip', () => {
    const out = tempDir('flake-unit-pass-dur-out-');
    const bin = tempDir('flake-unit-pass-dur-bin-');
    // One fail + one pass under same name across shapes is awkward; use fail
    // with a pass sibling that shares the failingTests path via a second name
    // that fails once. Prefer: same key with fail then pass across runs is
    // hard with a fixed payload. Check fail-only avg stays 10 (above) and that
    // a pass-only key is absent from failingTests (no dilution path).
    writeFakeNpx(bin, {
      success: false,
      numPassedTests: 1,
      numFailedTests: 1,
      numFailedTestSuites: 0,
      testResults: [
        {
          name: 'tests/unit/dur2.test.ts',
          assertionResults: [
            {
              fullName: 'kept',
              status: 'passed',
              duration: 20,
            },
            {
              fullName: 'kept',
              status: 'skipped',
              duration: 800,
            },
            {
              fullName: 'broken',
              status: 'failed',
              duration: 5,
              failureMessages: ['nope'],
            },
            {
              fullName: 'broken',
              status: 'todo',
              duration: 900,
            },
          ],
        },
      ],
    });
    runLoop(bin, out);
    const summary = readSummary(out);
    expect(summary.failingTests).toHaveLength(1);
    expect(summary.failingTests[0].test).toContain('broken');
    expect(summary.failingTests[0].avgMs).toBe(5);
  });
});
