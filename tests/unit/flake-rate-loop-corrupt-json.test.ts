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
import { readReporterJson } from '../../scripts/lib/read-reporter-json.mjs';

const UNIT_LOOP = resolve(process.cwd(), 'scripts/flake-rate-unit-loop.mjs');
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

/** Fake `npx` ahead of PATH so loops never spawn real vitest/playwright. */
function writeFakeNpx(
  binDir: string,
  kind: 'unit' | 'e2e',
  body: 'corrupt' | 'valid' | 'null'
): void {
  const scriptPath = join(binDir, 'npx');
  const unitPayload =
    body === 'corrupt'
      ? 'printf "{" > "$out"'
      : body === 'null'
        ? 'printf "null" > "$out"'
        : 'printf \'{"success":true,"numPassedTests":1,"numFailedTests":0,"testResults":[]}\' > "$out"';
  const e2ePayload =
    body === 'corrupt'
      ? 'printf "{"'
      : body === 'null'
        ? 'printf "null"'
        : 'printf \'{"suites":[],"stats":{"expected":1,"unexpected":0,"flaky":0,"duration":1}}\'';
  const contents =
    kind === 'unit'
      ? `#!/bin/sh
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
${unitPayload}
exit 0
`
      : `#!/bin/sh
${e2ePayload}
exit 0
`;
  writeFileSync(scriptPath, contents, { mode: 0o755 });
  chmodSync(scriptPath, 0o755);
}

describe('readReporterJson (q-mp-1024)', () => {
  it('returns missing json without throwing', () => {
    const dir = tempDir('flake-missing-');
    const result = readReporterJson(join(dir, 'nope.json'));
    expect(result).toEqual({ ok: false, error: 'missing json' });
  });

  it('returns corrupt json for truncated reporter output', () => {
    const dir = tempDir('flake-corrupt-');
    const path = join(dir, 'bad.json');
    writeFileSync(path, '{');
    const result = readReporterJson(path);
    expect(result).toEqual({ ok: false, error: 'corrupt json' });
  });

  it('returns unreadable json when readFileSync throws', () => {
    const result = readReporterJson('/tmp/ignored.json', {
      existsSync: () => true,
      readFileSync: () => {
        throw new Error('EACCES');
      },
    });
    expect(result).toEqual({ ok: false, error: 'unreadable json' });
  });

  it('parses valid reporter JSON', () => {
    const dir = tempDir('flake-valid-');
    const path = join(dir, 'ok.json');
    writeFileSync(path, '{"success":true,"numPassedTests":0}');
    const result = readReporterJson(path);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({ success: true, numPassedTests: 0 });
    }
  });
});

describe('flake-rate loops tolerate corrupt reporter JSON (q-mp-1024)', () => {
  it('unit loop records corrupt json and still writes summary (no uncaught parse)', () => {
    const out = tempDir('flake-unit-corrupt-out-');
    const bin = tempDir('flake-unit-corrupt-bin-');
    writeFakeNpx(bin, 'unit', 'corrupt');
    const result = spawnSync(
      process.execPath,
      [UNIT_LOOP, '--runs', '1', '--shuffle', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).not.toMatch(/SyntaxError/);
    expect(combined).not.toMatch(/Unexpected end of JSON/i);
    const summaryPath = join(out, 'unit-summary.json');
    expect(() => readFileSync(summaryPath, 'utf8')).not.toThrow();
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as {
      runSummaries: Array<{ ok: boolean; error?: string }>;
    };
    expect(summary.runSummaries.length).toBe(2);
    expect(summary.runSummaries.every((r) => r.error === 'corrupt json')).toBe(
      true
    );
    expect(summary.runSummaries.every((r) => r.ok === false)).toBe(true);
    // All runs failed ingest → must not exit 0 (q-mp-1339).
    expect(result.status).not.toBe(0);
    expect(combined).toMatch(/all 2 runs failed to ingest reporter JSON/);
  });

  it('e2e loop records corrupt json and still writes summary (no uncaught parse)', () => {
    const out = tempDir('flake-e2e-corrupt-out-');
    const bin = tempDir('flake-e2e-corrupt-bin-');
    writeFakeNpx(bin, 'e2e', 'corrupt');
    const result = spawnSync(
      process.execPath,
      [E2E_LOOP, '--runs', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).not.toMatch(/SyntaxError/);
    expect(combined).not.toMatch(/Unexpected end of JSON/i);
    const summaryPath = join(out, 'e2e-summary.json');
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as {
      runSummaries: Array<{ ok: boolean; error?: string }>;
    };
    expect(summary.runSummaries).toEqual([
      { runId: 'e2e-1', ok: false, error: 'corrupt json' },
    ]);
    // All runs failed ingest → must not exit 0 (q-mp-1339).
    expect(result.status).not.toBe(0);
    expect(combined).toMatch(/all 1 runs failed to ingest reporter JSON/);
  });

  it('e2e loop records non-object json root for JSON null (q-mp-1153)', () => {
    const out = tempDir('flake-e2e-null-out-');
    const bin = tempDir('flake-e2e-null-bin-');
    writeFakeNpx(bin, 'e2e', 'null');
    const result = spawnSync(
      process.execPath,
      [E2E_LOOP, '--runs', '1', '--out', out],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      }
    );
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).not.toMatch(/TypeError/);
    expect(combined).not.toMatch(/Cannot read properties of null/i);
    const summary = JSON.parse(
      readFileSync(join(out, 'e2e-summary.json'), 'utf8')
    ) as {
      runSummaries: Array<{ ok: boolean; error?: string }>;
    };
    expect(summary.runSummaries).toEqual([
      { runId: 'e2e-1', ok: false, error: 'non-object json root' },
    ]);
    expect(result.status).not.toBe(0);
  });

  it('unit loop missing-json path stays ok:false error missing json', () => {
    const out = tempDir('flake-unit-missing-out-');
    const bin = tempDir('flake-unit-missing-bin-');
    // Fake npx exits without writing --outputFile
    writeFileSync(
      join(bin, 'npx'),
      `#!/bin/sh
exit 0
`,
      { mode: 0o755 }
    );
    chmodSync(join(bin, 'npx'), 0o755);
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
    ) as { runSummaries: Array<{ error?: string }> };
    expect(summary.runSummaries.every((r) => r.error === 'missing json')).toBe(
      true
    );
    expect(result.status).not.toBe(0);
  });

  it('unit loop with valid green reporter JSON still exits 0 (q-mp-1339)', () => {
    const out = tempDir('flake-unit-green-out-');
    const bin = tempDir('flake-unit-green-bin-');
    writeFakeNpx(bin, 'unit', 'valid');
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
      runSummaries: Array<{ ok: boolean; error?: string }>;
      failingCount: number;
    };
    expect(summary.runSummaries.every((r) => r.ok === true && !r.error)).toBe(
      true
    );
    expect(summary.failingCount).toBe(0);
    expect(result.status).toBe(0);
  });
});
