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

describe('flake-rate unit loop summary failed vs lying numFailedTests (q-mp-1340)', () => {
  it('summary failed uses max(walked, reported) when numFailedTests is 0', () => {
    const out = tempDir('flake-unit-failed-summary-out-');
    const bin = tempDir('flake-unit-failed-summary-bin-');
    writeFakeNpx(bin, {
      success: false,
      numPassedTests: 0,
      numFailedTests: 0,
      testResults: [
        {
          name: 'tests/unit/lying.test.ts',
          assertionResults: [
            {
              fullName: 'walked fail',
              status: 'failed',
              duration: 1,
              failureMessages: ['boom'],
            },
          ],
        },
      ],
    });
    const result = spawnSync(
      process.execPath,
      [UNIT_LOOP, '--runs', '1', '--shuffle', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const summary = JSON.parse(
      readFileSync(join(out, 'unit-summary.json'), 'utf8')
    ) as {
      runSummaries: Array<{ ok: boolean; failed?: number; error?: string }>;
      failingCount: number;
    };
    expect(summary.runSummaries.length).toBe(2);
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
    expect(summary.runSummaries.every((r) => r.failed === 1)).toBe(true);
    expect(summary.failingCount).toBeGreaterThan(0);
    expect(result.status).not.toBe(0);
  });
});
