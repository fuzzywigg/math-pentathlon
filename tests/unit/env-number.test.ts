/**
 * @vitest-environment node
 *
 * Hermetic coverage for harness env Number() validation (q-mp-876).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  parseEnvNumber,
  requireEnvNumber,
} from '../../scripts/lib/env-number.mjs';

const MEM_SCRIPT = resolve(process.cwd(), 'scripts/memory-leak-audit.mjs');
const RUNTIME_SCRIPT = resolve(process.cwd(), 'scripts/runtime-perf.mjs');

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
