/**
 * q-mp-1374: Calla deep-playtest must honor PLAYTEST_BASE like peer harnesses.
 * Source wiring only — harness launches Playwright on import.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const HARNESS = resolve(process.cwd(), 'scripts/calla-deep-playtest.mjs');
const PEER = resolve(process.cwd(), 'scripts/ramrod-deep-playtest.mjs');

describe('calla-deep-playtest PLAYTEST_BASE parity (q-mp-1374)', () => {
  it('reads PLAYTEST_BASE first, keeps PLAYTEST_BASE_URL fallback, defaults to 127.0.0.1', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(
      /process\.env\.PLAYTEST_BASE\s*\|\|\s*[\s\S]*?process\.env\.PLAYTEST_BASE_URL\s*\|\|\s*['"]http:\/\/127\.0\.0\.1:5173['"]/
    );
    expect(src).not.toMatch(
      /const BASE = process\.env\.PLAYTEST_BASE_URL \|\| ['"]http:\/\/localhost:5173['"]/
    );
    expect(src).not.toMatch(/['"]http:\/\/localhost:5173['"]/);
  });

  it('usage documents PLAYTEST_BASE with peer default host', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(
      /PLAYTEST_BASE\s+Base URL \(default http:\/\/127\.0\.0\.1:5173\)/
    );
    expect(src).toMatch(/PLAYTEST_BASE_URL\s+Alias for PLAYTEST_BASE/);
    expect(src).toMatch(
      /Requires Vite on PLAYTEST_BASE \(default http:\/\/127\.0\.0\.1:5173\)/
    );
  });

  it('--help prints PLAYTEST_BASE (not BASE_URL-only) and peer default', () => {
    const r = spawnSync(process.execPath, [HARNESS, '--help'], {
      encoding: 'utf8',
      env: { ...process.env },
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/PLAYTEST_BASE/);
    expect(r.stdout).toMatch(/127\.0\.0\.1:5173/);
    expect(r.stdout).toMatch(/PLAYTEST_BASE_URL/);
  });

  it('peer ramrod still uses PLAYTEST_BASE + 127.0.0.1 (no drift)', () => {
    const peer = readFileSync(PEER, 'utf8');
    expect(peer).toMatch(
      /const BASE = process\.env\.PLAYTEST_BASE \|\| ['"]http:\/\/127\.0\.0\.1:5173['"]/
    );
  });
});
