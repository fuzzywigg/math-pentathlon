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

/**
 * Fake `npx` that writes a Vitest JSON shape with success:true but
 * numFailedTests > 0 (and matching failed assertionResults).
 */
function writeFakeNpxSuccessWithFailures(binDir: string): void {
  const scriptPath = join(binDir, 'npx');
  const payload = JSON.stringify({
    success: true,
    numPassedTests: 0,
    numFailedTests: 2,
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
          {
            fullName: 'fake b',
            status: 'failed',
            duration: 1,
            failureMessages: ['expected b'],
          },
        ],
      },
    ],
  });
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
printf '%s' '${payload.replace(/'/g, "'\\''")}' > "$out"
exit 0
`,
    { mode: 0o755 }
  );
  chmodSync(scriptPath, 0o755);
}

describe('flake-rate unit loop ok vs success (q-mp-1034)', () => {
  it('marks ok:false when success:true but numFailedTests>0', () => {
    const out = tempDir('flake-unit-ok-fail-out-');
    const bin = tempDir('flake-unit-ok-fail-bin-');
    writeFakeNpxSuccessWithFailures(bin);
    const result = spawnSync(
      process.execPath,
      [UNIT_LOOP, '--runs', '1', '--shuffle', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const summaryPath = join(out, 'unit-summary.json');
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as {
      runSummaries: Array<{
        ok: boolean;
        failed?: number;
        error?: string;
      }>;
      failingCount: number;
    };
    expect(summary.runSummaries.length).toBe(2);
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
    expect(summary.runSummaries.every((r) => r.failed === 2)).toBe(true);
    expect(summary.runSummaries.every((r) => r.error === undefined)).toBe(true);
    expect(summary.failingCount).toBeGreaterThan(0);
    // Loop exits non-zero when failingTests are present.
    expect(result.status).not.toBe(0);
  });
});
