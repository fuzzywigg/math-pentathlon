/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-923: memory-leak-audit adopts shared page-ready
 * helpers (no local waitGameReady / startHuman; 25s ready timeout preserved).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const SCRIPT = resolve(ROOT, 'scripts/memory-leak-audit.mjs');

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
