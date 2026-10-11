/**
 * @vitest-environment node
 *
 * Hermetic coverage for harness env Number() validation (q-mp-876 / q-mp-908).
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

  it('runtime-perf exits non-zero on PERF_MOVES=abc before browser launch', () => {
    const r = spawnSync(process.execPath, [RUNTIME_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, PERF_MOVES: 'abc' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid PERF_MOVES="abc"/);
    expect(text).not.toMatch(/browserType\.launch/);
  });
});

describe('deep-playtest GAMES_* env rejection (q-mp-908)', () => {
  it('calla-deep-playtest exits non-zero on CALLA_GAMES_PER=abc before browser launch', () => {
    const r = spawnSync(process.execPath, [CALLA_PLAYTEST], {
      encoding: 'utf8',
      env: { ...process.env, CALLA_GAMES_PER: 'abc' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid CALLA_GAMES_PER="abc"/);
    expect(text).not.toMatch(/NaN games/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('sum-dominoes-deep-playtest exits non-zero on SD_GAMES=0 before browser launch', () => {
    const r = spawnSync(process.execPath, [SD_PLAYTEST], {
      encoding: 'utf8',
      env: { ...process.env, SD_GAMES: '0' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid SD_GAMES="0"/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('ramrod-deep-playtest exits non-zero on RAMROD_GAMES=abc before browser launch', () => {
    const r = spawnSync(process.execPath, [RAMROD_PLAYTEST], {
      encoding: 'utf8',
      env: { ...process.env, RAMROD_GAMES: 'abc' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid RAMROD_GAMES="abc"/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('stars-bars-deep-playtest exits non-zero on STARS_GAMES=-1 before browser launch', () => {
    const r = spawnSync(process.execPath, [STARS_PLAYTEST], {
      encoding: 'utf8',
      env: { ...process.env, STARS_GAMES: '-1' },
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid STARS_GAMES="-1"/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('par-55-deep-playtest rejects PAR55_GAMES=abc when PAR55_QUICK unset', () => {
    const env = { ...process.env, PAR55_GAMES: 'abc' };
    delete env.PAR55_QUICK;
    const r = spawnSync(process.execPath, [PAR55_PLAYTEST], {
      encoding: 'utf8',
      env,
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid PAR55_GAMES="abc"/);
    expect(text).not.toMatch(/browserType\.launch/);
  });

  it('par-55-deep-playtest preserves PAR55_QUICK truthy short-circuit before PAR55_GAMES', () => {
    // Static: avoid spawning a real playtest when QUICK would force launch.
    const src = readFileSync(PAR55_PLAYTEST, 'utf8');
    expect(src).toMatch(/process\.env\.PAR55_QUICK\s*\?\s*1\s*:/);
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PAR55_GAMES['"]/);
  });
});
