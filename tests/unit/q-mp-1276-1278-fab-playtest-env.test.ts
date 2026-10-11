/**
 * Hermetic coverage for fab-a-diffy playtest env fixes:
 *   q-mp-1276 PLAYTEST_GAMES_PER reject NaN / non-positive
 *   q-mp-1277 PLAYTEST_SKIP_EXTRA_SHOTS '0'/'false' not set
 *   q-mp-1278 PLAYTEST_ONLY_VP / PLAYTEST_ONLY_DIFF validate keys
 * No Playwright launch. Stays on unit-shared (jsdom) so vitest.config
 * nodePureFiles need not change for this harness-only ticket.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnvNumber } from '../../scripts/lib/env-number.mjs';
import {
  FAB_DIFFICULTY_KEYS,
  FAB_VIEWPORT_KEYS,
  isSkipExtraShotsEnabled,
  resolveFabDifficulties,
  resolveFabViewports,
} from '../playtest/fab-a-diffy-env.mjs';

const FAB_PLAYTEST = resolve(
  process.cwd(),
  'tests/playtest/fab-a-diffy-deep.mjs'
);

function readHarness(): string {
  return readFileSync(FAB_PLAYTEST, 'utf8');
}

const ALL_VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
};

describe('q-mp-1276 PLAYTEST_GAMES_PER reject NaN / non-positive', () => {
  it('fab-a-diffy-deep wires PLAYTEST_GAMES_PER through requireEnvNumber before launch', () => {
    const src = readHarness();
    expect(src).toMatch(
      /from\s+['"]\.\.\/\.\.\/scripts\/lib\/env-number\.mjs['"]/
    );
    expect(src).toMatch(/requireEnvNumber\(\s*['"]PLAYTEST_GAMES_PER['"]/);
    expect(src).not.toMatch(
      /Number\(\s*process\.env\.PLAYTEST_GAMES_PER\s*\|\|/
    );
    const requireIdx = src.search(
      /requireEnvNumber\(\s*['"]PLAYTEST_GAMES_PER['"]/
    );
    const launchIdx = src.search(/chromium\.launch/);
    expect(requireIdx).toBeGreaterThanOrEqual(0);
    expect(launchIdx).toBeGreaterThan(requireIdx);
  });

  it('rejects NaN / zero / negative / non-integer; accepts unset and positives', () => {
    expect(parseEnvNumber({}, 'PLAYTEST_GAMES_PER', 10)).toEqual({
      ok: true,
      value: 10,
    });
    expect(
      parseEnvNumber({ PLAYTEST_GAMES_PER: '' }, 'PLAYTEST_GAMES_PER', 10)
    ).toEqual({ ok: true, value: 10 });
    expect(
      parseEnvNumber({ PLAYTEST_GAMES_PER: '3' }, 'PLAYTEST_GAMES_PER', 10)
    ).toEqual({ ok: true, value: 3 });

    for (const bad of ['nope', '0', '-1', '2.5', 'false']) {
      const got = parseEnvNumber(
        { PLAYTEST_GAMES_PER: bad },
        'PLAYTEST_GAMES_PER',
        10
      );
      expect(got.ok).toBe(false);
      if (!got.ok) {
        expect(got.message).toMatch(/Invalid PLAYTEST_GAMES_PER=/);
      }
    }
  });
});

describe('q-mp-1277 PLAYTEST_SKIP_EXTRA_SHOTS enable tokens', () => {
  it('enables only 1 / true / yes (case-insensitive, trimmed)', () => {
    expect(isSkipExtraShotsEnabled('1')).toBe(true);
    expect(isSkipExtraShotsEnabled('true')).toBe(true);
    expect(isSkipExtraShotsEnabled('YES')).toBe(true);
    expect(isSkipExtraShotsEnabled(' True ')).toBe(true);
  });

  it('disables 0 / false / empty / unset / other strings', () => {
    expect(isSkipExtraShotsEnabled(undefined)).toBe(false);
    expect(isSkipExtraShotsEnabled(null)).toBe(false);
    expect(isSkipExtraShotsEnabled('')).toBe(false);
    expect(isSkipExtraShotsEnabled('0')).toBe(false);
    expect(isSkipExtraShotsEnabled('false')).toBe(false);
    expect(isSkipExtraShotsEnabled('no')).toBe(false);
    expect(isSkipExtraShotsEnabled('2')).toBe(false);
  });

  it('fab-a-diffy-deep gates extra shots via isSkipExtraShotsEnabled', () => {
    const src = readHarness();
    expect(src).toMatch(
      /isSkipExtraShotsEnabled\(\s*process\.env\.PLAYTEST_SKIP_EXTRA_SHOTS\s*\)/
    );
    // Old truthy short-circuit must be gone.
    expect(src).not.toMatch(
      /if\s*\(\s*!process\.env\.PLAYTEST_SKIP_EXTRA_SHOTS\s*\)/
    );
  });
});

describe('q-mp-1278 PLAYTEST_ONLY_VP / PLAYTEST_ONLY_DIFF validate keys', () => {
  it('ONLY_VP: unset/empty → all; known keys filter; unknown error', () => {
    expect(resolveFabViewports(undefined, ALL_VIEWPORTS)).toEqual({
      ok: true,
      viewports: ALL_VIEWPORTS,
      onlyVp: undefined,
    });
    expect(resolveFabViewports('', ALL_VIEWPORTS)).toEqual({
      ok: true,
      viewports: ALL_VIEWPORTS,
      onlyVp: undefined,
    });
    expect(resolveFabViewports('desktop', ALL_VIEWPORTS)).toEqual({
      ok: true,
      viewports: { desktop: ALL_VIEWPORTS.desktop },
      onlyVp: 'desktop',
    });
    expect(resolveFabViewports('tablet', ALL_VIEWPORTS)).toEqual({
      ok: true,
      viewports: { tablet: ALL_VIEWPORTS.tablet },
      onlyVp: 'tablet',
    });

    for (const bad of ['0', 'false', 'phone', 'desktop ']) {
      const got = resolveFabViewports(bad, ALL_VIEWPORTS);
      expect(got.ok).toBe(false);
      if (!got.ok) {
        expect(got.message).toMatch(/Invalid PLAYTEST_ONLY_VP=/);
        expect(got.message).toMatch(/desktop, tablet/);
      }
    }
  });

  it('ONLY_DIFF: unset/empty → all; known keys filter; unknown error', () => {
    expect(resolveFabDifficulties(undefined)).toEqual({
      ok: true,
      difficulties: [...FAB_DIFFICULTY_KEYS],
      onlyDiff: undefined,
    });
    expect(resolveFabDifficulties('')).toEqual({
      ok: true,
      difficulties: [...FAB_DIFFICULTY_KEYS],
      onlyDiff: undefined,
    });
    expect(resolveFabDifficulties('easy')).toEqual({
      ok: true,
      difficulties: ['easy'],
      onlyDiff: 'easy',
    });
    expect(resolveFabDifficulties('medium')).toEqual({
      ok: true,
      difficulties: ['medium'],
      onlyDiff: 'medium',
    });
    expect(resolveFabDifficulties('hard')).toEqual({
      ok: true,
      difficulties: ['hard'],
      onlyDiff: 'hard',
    });

    for (const bad of ['0', 'false', 'insane', 'Easy']) {
      const got = resolveFabDifficulties(bad);
      expect(got.ok).toBe(false);
      if (!got.ok) {
        expect(got.message).toMatch(/Invalid PLAYTEST_ONLY_DIFF=/);
        expect(got.message).toMatch(/easy, medium, hard/);
      }
    }
  });

  it('known viewport / difficulty key lists match harness ALL_VIEWPORTS + DIFFICULTIES', () => {
    expect([...FAB_VIEWPORT_KEYS]).toEqual(['desktop', 'tablet']);
    expect([...FAB_DIFFICULTY_KEYS]).toEqual(['easy', 'medium', 'hard']);
    const src = readHarness();
    expect(src).toMatch(
      /resolveFabViewports\(\s*process\.env\.PLAYTEST_ONLY_VP/
    );
    expect(src).toMatch(
      /resolveFabDifficulties\(\s*process\.env\.PLAYTEST_ONLY_DIFF/
    );
    // Old invent-undefined / invent-string filters must be gone.
    expect(src).not.toMatch(
      /ONLY_VP\s*\?\s*\{\s*\[ONLY_VP\]:\s*ALL_VIEWPORTS\[ONLY_VP\]/
    );
    expect(src).not.toMatch(/ONLY_DIFF\s*\?\s*\[ONLY_DIFF\]/);
  });
});
