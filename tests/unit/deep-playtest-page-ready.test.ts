/**
 * @vitest-environment node
 *
 * Hermetic coverage for deep-playtest page-ready adoption (q-mp-925).
 * Structural asserts only — no Playwright browser launch.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPTS = [
  'scripts/calla-deep-playtest.mjs',
  'scripts/ramrod-deep-playtest.mjs',
  'scripts/sum-dominoes-deep-playtest.mjs',
  'scripts/stars-bars-deep-playtest.mjs',
  'scripts/par-55-deep-playtest.mjs',
] as const;

function readScript(rel: string): string {
  return readFileSync(resolve(process.cwd(), rel), 'utf8');
}

function runHelp(script: string) {
  return spawnSync(process.execPath, [resolve(process.cwd(), script), '--help'], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

describe('deep-playtest page-ready adoption (q-mp-925)', () => {
  for (const script of SCRIPTS) {
    it(`${script} imports waitForGameReady from page-ready`, () => {
      const src = readScript(script);
      expect(src).toMatch(
        /import\s+\{\s*waitForGameReady\s*\}\s+from\s+['"]\.\/lib\/page-ready\.mjs['"]/
      );
      expect(src).toMatch(/await waitForGameReady\(page\)/);
      // Local loading-chrome waits must be gone (shared helper owns them).
      expect(src).not.toMatch(/getByTestId\(\s*['"]game-loading['"]\s*\)/);
      // Local dismissOwl left for q-mp-879; do not force shared dismissOwl here.
      expect(src).toMatch(/async function dismissOwl\s*\(/);
    });

    it(`${script} --help still exits 0 without browser`, () => {
      const r = runHelp(script);
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).toMatch(/-h, --help/);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    });
  }
});
