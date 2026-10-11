/**
 * @vitest-environment node
 *
 * Hermetic coverage for harness env Number() validation (q-mp-876 / q-mp-908).
 * Playtest wiring is asserted via static source checks (q-mp-1069) so unit
 * wall-time does not pay Playwright module load on every GAMES_* probe.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseEnvNumber,
  requireEnvNumber,
} from '../../scripts/lib/env-number.mjs';

const MEM_SCRIPT = resolve(process.cwd(), 'scripts/memory-leak-audit.mjs');
const RUNTIME_SCRIPT = resolve(process.cwd(), 'scripts/runtime-perf.mjs');
const CALLA_PLAYTEST = resolve(
  process.cwd(),
  'scripts/calla-deep-playtest.mjs'
);
const SD_PLAYTEST = resolve(
  process.cwd(),
  'scripts/sum-dominoes-deep-playtest.mjs'
);
const RAMROD_PLAYTEST = resolve(
  process.cwd(),
  'scripts/ramrod-deep-playtest.mjs'
);
const STARS_PLAYTEST = resolve(
  process.cwd(),
  'scripts/stars-bars-deep-playtest.mjs'
);
const PAR55_PLAYTEST = resolve(
  process.cwd(),
  'scripts/par-55-deep-playtest.mjs'
);
const FRACTION_PINBALL_PLAYTEST = resolve(
  process.cwd(),
  'docs/playtest/fraction-pinball-deep-playtest.mjs'
);
const AI_CALIBRATION = resolve(process.cwd(), 'scripts/run-ai-calibration.ts');

/** Assert a harness imports env-number and calls requireEnvNumber for `name`. */
function expectRequireEnvNumberWiring(
  scriptPath: string,
  envName: string
): void {
  const src = readFileSync(scriptPath, 'utf8');
  expect(src).toMatch(/from\s+['"]\.\/lib\/env-number\.mjs['"]/);
  expect(src).toMatch(new RegExp(`requireEnvNumber\\(\\s*['"]${envName}['"]`));
  // Top-level validation must run before any Playwright launch call site.
  const requireIdx = src.search(
    new RegExp(`requireEnvNumber\\(\\s*['"]${envName}['"]`)
  );
  const launchIdx = src.search(/chromium\.launch|browserType\.launch/);
  expect(requireIdx).toBeGreaterThanOrEqual(0);
  if (launchIdx >= 0) {
    expect(requireIdx).toBeLessThan(launchIdx);
  }
}

describe('parseEnvNumber (q-mp-876)', () => {
  it('uses the default when the env var is unset', () => {
    expect(parseEnvNumber({}, 'PERF_MOVES', 30)).toEqual({
      ok: true,
      value: 30,
    });
  });

  it('uses the default when the env var is empty', () => {
    expect(parseEnvNumber({ PERF_MOVES: '' }, 'PERF_MOVES', 20)).toEqual({
      ok: true,
      value: 20,
    });
  });

  it('accepts a finite positive numeric string', () => {
    expect(
      parseEnvNumber({ MEM_LEAK_PORT: '5181' }, 'MEM_LEAK_PORT', 5181)
    ).toEqual({
      ok: true,
      value: 5181,
    });
  });

  it('rejects non-finite values and names the variable', () => {
    const got = parseEnvNumber({ MEM_LEAK_PORT: 'abc' }, 'MEM_LEAK_PORT', 5181);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid MEM_LEAK_PORT="abc"/);
      expect(got.message).toMatch(/finite number/);
    }
  });

  it('rejects non-positive values when requirePositive (default)', () => {
    const got = parseEnvNumber({ PERF_MOVES: '0' }, 'PERF_MOVES', 30);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid PERF_MOVES="0"/);
      expect(got.message).toMatch(/positive number/);
    }
  });

  it('allows non-positive when requirePositive is false', () => {
    expect(
      parseEnvNumber({ X: '0' }, 'X', 1, { requirePositive: false })
    ).toEqual({ ok: true, value: 0 });
  });

  it('rejects non-integer positives for count-like envs (q-mp-1234)', () => {
    const got = parseEnvNumber({ PERF_MOVES: '2.5' }, 'PERF_MOVES', 20);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid PERF_MOVES="2\.5"/);
      expect(got.message).toMatch(/integer/);
    }
  });

  it('still accepts integer positives after integer default (q-mp-1234)', () => {
    expect(parseEnvNumber({ PERF_MOVES: '2' }, 'PERF_MOVES', 20)).toEqual({
      ok: true,
      value: 2,
    });
  });

  it('allows non-integers when integer is false (q-mp-1234)', () => {
    expect(parseEnvNumber({ X: '2.5' }, 'X', 1, { integer: false })).toEqual({
      ok: true,
      value: 2.5,
    });
  });
});

describe('requireEnvNumber (q-mp-876)', () => {
  it('returns the default when unset', () => {
    const prev = process.env.PERF_FRAME_MS;
    delete process.env.PERF_FRAME_MS;
    try {
      expect(requireEnvNumber('PERF_FRAME_MS', 2000)).toBe(2000);
    } finally {
      if (prev === undefined) delete process.env.PERF_FRAME_MS;
      else process.env.PERF_FRAME_MS = prev;
    }
  });
});

describe('harness CLI env rejection (q-mp-876)', () => {
  // One spawn smoke: process exit + message before browser launch (q-mp-1069).
  it('memory-leak-audit exits non-zero on MEM_LEAK_PORT=abc before browser launch', () => {
    const r = spawnSync(process.execPath, [MEM_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, MEM_LEAK_PORT: 'abc' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid MEM_LEAK_PORT="abc"/);
    expect(text).not.toMatch(/ERR_SOCKET_BAD_PORT/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('runtime-perf wires PERF_MOVES through requireEnvNumber before browser launch', () => {
    expectRequireEnvNumberWiring(RUNTIME_SCRIPT, 'PERF_MOVES');
    // Rejection semantics for PERF_MOVES=abc are covered by parseEnvNumber units.
    const got = parseEnvNumber({ PERF_MOVES: 'abc' }, 'PERF_MOVES', 30);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid PERF_MOVES="abc"/);
    }
  });
});

describe('deep-playtest GAMES_* env rejection (q-mp-908)', () => {
  it('calla-deep-playtest wires CALLA_GAMES_PER through requireEnvNumber before browser launch', () => {
    expectRequireEnvNumberWiring(CALLA_PLAYTEST, 'CALLA_GAMES_PER');
    const got = parseEnvNumber(
      { CALLA_GAMES_PER: 'abc' },
      'CALLA_GAMES_PER',
      10
    );
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid CALLA_GAMES_PER="abc"/);
    }
  });

  it('sum-dominoes-deep-playtest wires SD_GAMES through requireEnvNumber before browser launch', () => {
    expectRequireEnvNumberWiring(SD_PLAYTEST, 'SD_GAMES');
    const got = parseEnvNumber({ SD_GAMES: '0' }, 'SD_GAMES', 10);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid SD_GAMES="0"/);
    }
  });

  it('ramrod-deep-playtest wires RAMROD_GAMES through requireEnvNumber before browser launch', () => {
    expectRequireEnvNumberWiring(RAMROD_PLAYTEST, 'RAMROD_GAMES');
    const got = parseEnvNumber({ RAMROD_GAMES: 'abc' }, 'RAMROD_GAMES', 10);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid RAMROD_GAMES="abc"/);
    }
  });

  it('stars-bars-deep-playtest wires STARS_GAMES through requireEnvNumber before browser launch', () => {
    expectRequireEnvNumberWiring(STARS_PLAYTEST, 'STARS_GAMES');
    const got = parseEnvNumber({ STARS_GAMES: '-1' }, 'STARS_GAMES', 10);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid STARS_GAMES="-1"/);
    }
  });

  it('par-55-deep-playtest wires PAR55_GAMES through requireEnvNumber when QUICK unset', () => {
    const src = readFileSync(PAR55_PLAYTEST, 'utf8');
    expect(src).toMatch(/from\s+['"]\.\/lib\/env-number\.mjs['"]/);
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PAR55_GAMES['"]/);
    const got = parseEnvNumber({ PAR55_GAMES: 'abc' }, 'PAR55_GAMES', 10);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid PAR55_GAMES="abc"/);
    }
  });

  it('par-55-deep-playtest gates PAR55_QUICK via isPar55QuickEnabled before PAR55_GAMES', () => {
    // Static: avoid spawning a real playtest when QUICK would force launch.
    // q-mp-1260: '0'/'false' must not truthy-short-circuit to 1 game.
    const src = readFileSync(PAR55_PLAYTEST, 'utf8');
    expect(src).toMatch(
      /isPar55QuickEnabled\(\s*process\.env\.PAR55_QUICK\s*\)/
    );
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PAR55_GAMES['"]/);
    expect(src).not.toMatch(/process\.env\.PAR55_QUICK\s*\?\s*1\s*:/);
  });

  it('fraction-pinball-deep-playtest wires PLAYTEST_GAMES through requireEnvNumber (q-mp-1279)', () => {
    const src = readFileSync(FRACTION_PINBALL_PLAYTEST, 'utf8');
    expect(src).toMatch(
      /from\s+['"]\.\.\/\.\.\/scripts\/lib\/env-number\.mjs['"]/
    );
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PLAYTEST_GAMES['"]/);
    expect(src).not.toMatch(
      /Number\(\s*process\.env\.PLAYTEST_GAMES\s*\|\|/
    );
    const requireIdx = src.search(
      /requireEnvNumber\(\s*['"]PLAYTEST_GAMES['"]/
    );
    const launchIdx = src.search(/chromium\.launch|browserType\.launch/);
    expect(requireIdx).toBeGreaterThanOrEqual(0);
    if (launchIdx >= 0) {
      expect(requireIdx).toBeLessThan(launchIdx);
    }
    for (const [raw, label] of [
      ['abc', 'non-finite'],
      ['false', 'non-finite'],
      ['0', 'non-positive'],
      ['-1', 'non-positive'],
      ['2.5', 'non-integer'],
    ] as const) {
      const got = parseEnvNumber({ PLAYTEST_GAMES: raw }, 'PLAYTEST_GAMES', 10);
      expect(got.ok, label).toBe(false);
      if (!got.ok) {
        expect(got.message).toMatch(
          new RegExp(`Invalid PLAYTEST_GAMES=${JSON.stringify(raw)}`)
        );
      }
    }
    expect(parseEnvNumber({}, 'PLAYTEST_GAMES', 10)).toEqual({
      ok: true,
      value: 10,
    });
    expect(parseEnvNumber({ PLAYTEST_GAMES: '3' }, 'PLAYTEST_GAMES', 10)).toEqual(
      {
        ok: true,
        value: 3,
      }
    );
    // Zero-length results must not emit avgDurationMs: NaN.
    expect(src).toMatch(/all\.length\s*===\s*0/);
    expect(src).toMatch(/avgDurationMs/);
  });
});

describe('ai-calibration CALIBRATION_GAMES env rejection (q-mp-1290)', () => {
  it('run-ai-calibration wires CALIBRATION_GAMES through requireEnvNumber', () => {
    const src = readFileSync(AI_CALIBRATION, 'utf8');
    expect(src).toMatch(/from\s+['"]\.\/lib\/env-number\.mjs['"]/);
    expect(src).toMatch(/requireEnvNumber\(\s*['"]CALIBRATION_GAMES['"]/);
    expect(src).not.toMatch(/Number\(\s*process\.env\.CALIBRATION_GAMES/);
  });

  it('rejects NaN / non-positive / non-integer CALIBRATION_GAMES (default 50)', () => {
    expect(parseEnvNumber({}, 'CALIBRATION_GAMES', 50)).toEqual({
      ok: true,
      value: 50,
    });
    expect(
      parseEnvNumber({ CALIBRATION_GAMES: '' }, 'CALIBRATION_GAMES', 50)
    ).toEqual({
      ok: true,
      value: 50,
    });
    expect(
      parseEnvNumber({ CALIBRATION_GAMES: '50' }, 'CALIBRATION_GAMES', 50)
    ).toEqual({ ok: true, value: 50 });
    expect(
      parseEnvNumber({ CALIBRATION_GAMES: '1' }, 'CALIBRATION_GAMES', 50)
    ).toEqual({ ok: true, value: 1 });

    for (const raw of ['abc', 'false', '0', '-1', '2.5'] as const) {
      const got = parseEnvNumber(
        { CALIBRATION_GAMES: raw },
        'CALIBRATION_GAMES',
        50
      );
      expect(got.ok).toBe(false);
      if (!got.ok) {
        expect(got.message).toMatch(
          new RegExp(`Invalid CALIBRATION_GAMES=${JSON.stringify(raw)}`)
        );
      }
    }
  });
});
