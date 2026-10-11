/**
 * @vitest-environment node
 *
 * Hermetic coverage for:
 * - q-mp-923: memory-leak-audit adopts shared page-ready helpers
 * - q-mp-1314: MEM_LEAK_GAMES all-unknown → exit 2 (no empty success)
 * - q-mp-1315: MEM_LEAK_DATE default stamps live UTC YYYY-MM-DD
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseMemLeakGamesFilter,
  resolveMemLeakDate,
  resolveMemLeakGames,
} from '../../scripts/lib/memory-leak-games.mjs';

const ROOT = process.cwd();
const SCRIPT = resolve(ROOT, 'scripts/memory-leak-audit.mjs');
const FIXTURE = [
  { id: 'hex', name: 'Hex' },
  { id: 'fiar', name: 'FIAR' },
  { id: 'calla', name: 'Calla' },
];

describe('memory-leak-audit page-ready adoption (q-mp-923)', () => {
  const src = readFileSync(SCRIPT, 'utf8');

  it('imports waitForGameReady and startHuman from page-ready', () => {
    expect(src).toMatch(
      /import\s*\{[^}]*waitForGameReady[^}]*\}\s*from\s*['"]\.\/lib\/page-ready\.mjs['"]/
    );
    expect(src).toMatch(
      /import\s*\{[^}]*startHuman[^}]*\}\s*from\s*['"]\.\/lib\/page-ready\.mjs['"]/
    );
  });

  it('does not define local waitGameReady or startHuman', () => {
    expect(src).not.toMatch(/async function waitGameReady\b/);
    expect(src).not.toMatch(/async function startHuman\b/);
    expect(src).not.toMatch(/function waitGameReady\b/);
    expect(src).not.toMatch(/function startHuman\b/);
  });

  it('keeps the 25s ready timeout via waitForGameReady options', () => {
    expect(src).toMatch(
      /waitForGameReady\(\s*page\s*,\s*\{\s*timeoutMs:\s*25_000\s*\}\s*\)/
    );
  });

  it('node --check passes', () => {
    const r = spawnSync(process.execPath, ['--check', SCRIPT], {
      encoding: 'utf8',
      cwd: ROOT,
    });
    expect(r.status).toBe(0);
    expect(r.stderr).toBe('');
  });

  it('--help still exits 0 without launching Playwright', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
      cwd: ROOT,
    });
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/memory-leak-audit\.mjs/);
    expect(text).toMatch(/MEM_LEAK_/);
  });
});

describe('parseMemLeakGamesFilter / resolveMemLeakGames (q-mp-1314)', () => {
  it('parses csv, trims, drops empties', () => {
    expect(parseMemLeakGamesFilter(' hex , ,fiar ')).toEqual(['hex', 'fiar']);
    expect(parseMemLeakGamesFilter('')).toEqual([]);
    expect(parseMemLeakGamesFilter(undefined)).toEqual([]);
  });

  it('empty filter returns all games', () => {
    expect(resolveMemLeakGames('', FIXTURE)).toEqual({
      ok: true,
      games: FIXTURE,
      filter: [],
    });
    expect(resolveMemLeakGames(undefined, FIXTURE).ok).toBe(true);
  });

  it('keeps valid subsets and drops unknown ids', () => {
    const got = resolveMemLeakGames('hex,bogus,fiar', FIXTURE);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.games.map((g) => g.id)).toEqual(['hex', 'fiar']);
    }
  });

  it('rejects all-unknown filter (no empty success)', () => {
    const got = resolveMemLeakGames('bogus,nope', FIXTURE);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.games).toEqual([]);
      expect(got.message).toMatch(/matched no known games/);
      expect(got.message).toMatch(/bogus,nope/);
      expect(got.message).toMatch(/hex/);
    }
  });

  it('exits 2 on MEM_LEAK_GAMES=bogus before browser launch', () => {
    const r = spawnSync(process.execPath, [SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, MEM_LEAK_GAMES: 'bogus' },
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/matched no known games/);
    expect(text).toMatch(/bogus/);
    expect(text).not.toMatch(/browserType\.launch/);
    expect(text).not.toMatch(/\d+ games ×/);
  });

  it('--help still exits 0 even when MEM_LEAK_GAMES is all-unknown', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
      cwd: ROOT,
      env: { ...process.env, MEM_LEAK_GAMES: 'bogus' },
    });
    expect(r.status).toBe(0);
    expect(`${r.stdout}\n${r.stderr}`).toMatch(/MEM_LEAK_GAMES/);
  });
});

describe('resolveMemLeakDate (q-mp-1315)', () => {
  it('uses env override when set', () => {
    expect(resolveMemLeakDate('2026-10-07')).toBe('2026-10-07');
  });

  it('defaults to UTC YYYY-MM-DD from now', () => {
    const fixed = new Date('2026-11-02T15:04:05.000Z');
    expect(resolveMemLeakDate(undefined, fixed)).toBe('2026-11-02');
    expect(resolveMemLeakDate('', fixed)).toBe('2026-11-02');
  });

  it('audit script wires live default (no hardcoded 2026-10-07 fallback)', () => {
    const src = readFileSync(SCRIPT, 'utf8');
    const lib = readFileSync(
      resolve(ROOT, 'scripts/lib/memory-leak-games.mjs'),
      'utf8'
    );
    expect(src).toMatch(
      /resolveMemLeakDate\(\s*process\.env\.MEM_LEAK_DATE\s*\)/
    );
    expect(src).not.toMatch(/MEM_LEAK_DATE\s*\|\|\s*['"]2026-10-07['"]/);
    expect(src).toMatch(/resolveMemLeakGames\(\s*process\.env\.MEM_LEAK_GAMES/);
    expect(lib).toMatch(/toISOString\(\)\.slice\(\s*0\s*,\s*10\s*\)/);
    expect(lib).not.toMatch(/2026-10-07/);
  });
});
