import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const UNIT_LOOP = resolve(process.cwd(), 'scripts/flake-rate-unit-loop.mjs');
const E2E_LOOP = resolve(process.cwd(), 'scripts/flake-rate-e2e-loop.mjs');

function runScript(script: string, argv: string[]) {
  return spawnSync(process.execPath, [script, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
  });
}

describe('flake-rate loop arg validation (q-mp-843)', () => {
  it('unit loop rejects non-numeric --runs before writing summary or spawning', () => {
    const out = mkdtempSync(join(tmpdir(), 'flake-unit-bad-'));
    try {
      const result = runScript(UNIT_LOOP, [
        '--runs',
        'abc',
        '--shuffle',
        '0',
        '--out',
        out,
      ]);
      expect(result.status).not.toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).toMatch(/Invalid --runs/i);
      expect(existsSync(join(out, 'unit-summary.json'))).toBe(false);
      expect(combined).not.toMatch(/\[flake-rate\] starting/);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  it('unit loop rejects non-positive --shuffle before spawning', () => {
    const out = mkdtempSync(join(tmpdir(), 'flake-unit-shuffle-bad-'));
    try {
      const result = runScript(UNIT_LOOP, [
        '--runs',
        '1',
        '--shuffle',
        '0',
        '--out',
        out,
      ]);
      expect(result.status).not.toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).toMatch(/Invalid --shuffle/i);
      expect(existsSync(join(out, 'unit-summary.json'))).toBe(false);
      expect(combined).not.toMatch(/\[flake-rate\] starting/);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  it('e2e loop rejects non-numeric --runs before writing summary or spawning', () => {
    const out = mkdtempSync(join(tmpdir(), 'flake-e2e-bad-'));
    try {
      const result = runScript(E2E_LOOP, ['--runs', 'abc', '--out', out]);
      expect(result.status).not.toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).toMatch(/Invalid --runs/i);
      expect(existsSync(join(out, 'e2e-summary.json'))).toBe(false);
      expect(combined).not.toMatch(/\[flake-rate-e2e\] starting/);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});

describe('flake-rate loop --out validation (q-mp-871)', () => {
  it('unit loop rejects trailing --out before mkdir or spawning', () => {
    const result = runScript(UNIT_LOOP, [
      '--runs',
      '1',
      '--shuffle',
      '1',
      '--out',
    ]);
    expect(result.status).not.toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Missing or invalid value for --out/);
    expect(combined).toMatch(/Usage:/i);
    expect(combined).not.toMatch(/\[flake-rate\] starting/);
  });

  it('e2e loop rejects flag-like --out value before mkdir or spawning', () => {
    const result = runScript(E2E_LOOP, ['--runs', '1', '--out', '--runs']);
    expect(result.status).not.toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Missing or invalid value for --out/);
    expect(combined).toMatch(/Usage:/i);
    expect(combined).not.toMatch(/\[flake-rate-e2e\] starting/);
  });
});

describe('flake-rate loop early --help (q-mp-893)', () => {
  for (const [script, label] of [
    [UNIT_LOOP, 'unit'],
    [E2E_LOOP, 'e2e'],
  ] as const) {
    it(`${label} loop --help prints usage and exits 0 without spawning`, () => {
      const result = runScript(script, ['--help']);
      expect(result.status).toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).toMatch(/-h, --help/);
      expect(combined).toMatch(/--runs/);
      expect(combined).toMatch(/--out/);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });

    it(`${label} loop -h prints usage and exits 0 without spawning`, () => {
      const result = runScript(script, ['-h']);
      expect(result.status).toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });

    it(`${label} loop rejects --wat with exit 2 without spawning`, () => {
      const result = runScript(script, ['--wat']);
      expect(result.status).toBe(2);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Unknown flag: --wat/);
      expect(combined).toMatch(/Usage:/i);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });
  }

  it('unit loop --help mentions --shuffle', () => {
    const result = runScript(UNIT_LOOP, ['--help']);
    expect(result.status).toBe(0);
    expect(`${result.stdout}${result.stderr}`).toMatch(/--shuffle/);
  });
});

describe('flake-rate loop --help anywhere in argv (q-mp-970)', () => {
  for (const [script, label] of [
    [UNIT_LOOP, 'unit'],
    [E2E_LOOP, 'e2e'],
  ] as const) {
    it(`${label} loop --out --help prints usage and exits 0 without mkdir/spawn`, () => {
      const result = runScript(script, ['--out', '--help']);
      expect(result.status).toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).toMatch(/-h, --help/);
      expect(combined).not.toMatch(/Missing or invalid value for --out/);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });

    it(`${label} loop --runs --help prints usage and exits 0 without spawn`, () => {
      const result = runScript(script, ['--runs', '--help']);
      expect(result.status).toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).not.toMatch(/Missing value for --runs/);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });

    it(`${label} loop --out -h prints usage and exits 0 without mkdir/spawn`, () => {
      const result = runScript(script, ['--out', '-h']);
      expect(result.status).toBe(0);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/Usage:/i);
      expect(combined).not.toMatch(/Missing or invalid value for --out/);
      expect(combined).not.toMatch(/\[flake-rate(?:-e2e)?\] starting/);
    });
  }

  it('unit loop trailing --out without help still exits non-zero', () => {
    const result = runScript(UNIT_LOOP, ['--out']);
    expect(result.status).not.toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Missing or invalid value for --out/);
    expect(combined).not.toMatch(/\[flake-rate\] starting/);
  });
});
