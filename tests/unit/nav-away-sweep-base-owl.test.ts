/**
 * @vitest-environment node
 *
 * Hermetic coverage for nav-away-sweep BASE_URL + dismissOwl (q-mp-1285 / q-mp-1286).
 * Structural asserts only — no Playwright browser launch.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { NAV_AWAY_SWEEP_USAGE } from '../../scripts/lib/browser-harness-script-usage.mjs';

const SCRIPT = 'scripts/nav-away-sweep.mjs';

function readScript(): string {
  return readFileSync(resolve(process.cwd(), SCRIPT), 'utf8');
}

describe('nav-away-sweep BASE_URL + dismissOwl (q-mp-1285 / q-mp-1286)', () => {
  it('honors BASE_URL with prior default when unset', () => {
    const src = readScript();
    expect(src).toMatch(
      /const BASE = process\.env\.BASE_URL \|\| 'http:\/\/127\.0\.0\.1:5173'/
    );
    expect(src).not.toMatch(/const BASE = 'http:\/\/127\.0\.0\.1:5173'/);
  });

  it('USAGE documents BASE_URL', () => {
    expect(NAV_AWAY_SWEEP_USAGE).toMatch(/BASE_URL/);
    expect(NAV_AWAY_SWEEP_USAGE).toMatch(/127\.0\.0\.1:5173/);
  });

  it('dismisses owl via shared helper before #new-game-btn', () => {
    const src = readScript();
    expect(src).toMatch(
      /import\s+\{\s*dismissOwl\s*\}\s+from\s+['"]\.\/lib\/dismiss-owl\.mjs['"]/
    );
    expect(src).toMatch(/await dismissOwl\(page\)/);
    const dismissIdx = src.indexOf('await dismissOwl(page)');
    const clickIdx = src.indexOf("#new-game-btn').click()");
    expect(dismissIdx).toBeGreaterThan(-1);
    expect(clickIdx).toBeGreaterThan(dismissIdx);
    expect(src).toMatch(/await waitForGameReady\(page/);
  });

  it('keeps the existing game list length (1070 stays separate)', () => {
    const src = readScript();
    const match = src.match(/const GAMES = \[([\s\S]*?)\];/);
    expect(match).toBeTruthy();
    const ids = match![1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^'[^']+',?$/.test(line));
    expect(ids).toHaveLength(12);
  });

  it('--help prints BASE_URL and exits 0 without browser launch', () => {
    const r = spawnSync(process.execPath, [resolve(process.cwd(), SCRIPT), '--help'], {
      encoding: 'utf8',
      timeout: 15_000,
      env: { ...process.env },
    });
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/nav-away-sweep\.mjs/);
    expect(text).toMatch(/BASE_URL/);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });
});
