/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1259 (word-boundary end regexes) and
 * q-mp-1260 (PAR55_QUICK '0'/'false' disable). No Playwright launch.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  END_RE_SOURCE,
  isDeepPlaytestDrawStatus,
  isDeepPlaytestEndStatus,
  isDeepPlaytestTieStatus,
  isPar55QuickEnabled,
} from '../../scripts/lib/deep-playtest-end.mjs';

const HARNESSES = [
  'scripts/stars-bars-deep-playtest.mjs',
  'scripts/ramrod-deep-playtest.mjs',
  'scripts/par-55-deep-playtest.mjs',
  'scripts/sum-dominoes-deep-playtest.mjs',
] as const;

function readScript(rel: string): string {
  return readFileSync(resolve(process.cwd(), rel), 'utf8');
}

describe('q-mp-1259 deep-playtest end status word boundaries', () => {
  it('rejects Drawing / patience substring false-ends', () => {
    expect(isDeepPlaytestEndStatus('Drawing card')).toBe(false);
    expect(isDeepPlaytestEndStatus('patience')).toBe(false);
    expect(isDeepPlaytestDrawStatus('Drawing card')).toBe(false);
    expect(isDeepPlaytestDrawStatus('patience')).toBe(false);
    expect(isDeepPlaytestTieStatus('patience')).toBe(false);
  });

  it('still matches real win / tie / draw banners', () => {
    expect(isDeepPlaytestEndStatus('Blue wins!')).toBe(true);
    expect(isDeepPlaytestEndStatus('Red wins with 24cm!')).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a tie!")).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a Tie! 🤝")).toBe(true);
    expect(isDeepPlaytestEndStatus('Draw!')).toBe(true);
    expect(isDeepPlaytestDrawStatus("It's a tie!")).toBe(true);
    expect(isDeepPlaytestDrawStatus('draw')).toBe(true);
    expect(isDeepPlaytestTieStatus("It's a tie!")).toBe(true);
  });

  it('END_RE_SOURCE is the word-boundary body used in page callbacks', () => {
    expect(END_RE_SOURCE).toBe(String.raw`\bwins\b|\btie\b|\bdraw\b`);
    const endRe = new RegExp(END_RE_SOURCE, 'i');
    expect(endRe.test('Drawing card')).toBe(false);
    expect(endRe.test('patience')).toBe(false);
    expect(endRe.test('Blue wins!')).toBe(true);
  });

  for (const script of HARNESSES) {
    it(`${script} imports deep-playtest-end helpers (no bare /tie|draw/ end matchers)`, () => {
      const src = readScript(script);
      expect(src).toMatch(/from\s+['"]\.\/lib\/deep-playtest-end\.mjs['"]/);
      expect(src).not.toMatch(/\/wins!?\|draw\|tie\/i/);
      expect(src).not.toMatch(/\/wins\|tie\|draw\/i/);
      expect(src).not.toMatch(/\/wins!?\|tie\/i/);
      expect(src).not.toMatch(/\/wins\|tie\/i/);
      expect(src).not.toMatch(/\/tie\|draw\/i/);
      expect(src).not.toMatch(/\/draw\|tie\/i/);
      // Bare /tie/i outcome classifiers must be gone too.
      expect(src).not.toMatch(/\/tie\/i\.test/);
    });
  }
});

describe('q-mp-1260 PAR55_QUICK enable tokens', () => {
  it('enables only 1 / true / yes (case-insensitive, trimmed)', () => {
    expect(isPar55QuickEnabled('1')).toBe(true);
    expect(isPar55QuickEnabled('true')).toBe(true);
    expect(isPar55QuickEnabled('YES')).toBe(true);
    expect(isPar55QuickEnabled(' True ')).toBe(true);
  });

  it('disables 0 / false / empty / unset / other strings', () => {
    expect(isPar55QuickEnabled(undefined)).toBe(false);
    expect(isPar55QuickEnabled(null)).toBe(false);
    expect(isPar55QuickEnabled('')).toBe(false);
    expect(isPar55QuickEnabled('0')).toBe(false);
    expect(isPar55QuickEnabled('false')).toBe(false);
    expect(isPar55QuickEnabled('no')).toBe(false);
    expect(isPar55QuickEnabled('2')).toBe(false);
  });

  it('par-55-deep-playtest wires isPar55QuickEnabled before PAR55_GAMES', () => {
    const src = readScript('scripts/par-55-deep-playtest.mjs');
    expect(src).toMatch(/isPar55QuickEnabled\(\s*process\.env\.PAR55_QUICK\s*\)/);
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PAR55_GAMES['"]/);
    // Old truthy short-circuit must be gone.
    expect(src).not.toMatch(/process\.env\.PAR55_QUICK\s*\?\s*1\s*:/);
  });
});
