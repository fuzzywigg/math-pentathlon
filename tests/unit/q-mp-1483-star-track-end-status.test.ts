/**
 * q-mp-1483: star-track deep-playtest status end must match live HvA
 * "You Wins!". Hermetic stubs — no Playwright / vitest.config edit.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  STAR_TRACK_END_WIN_STATUS_RE,
  STAR_TRACK_END_WIN_STATUS_RE_SOURCE,
  isStarTrackEndWinStatus,
} from '../playtest/star-track-end-status.mjs';

const HARNESS = resolve(
  process.cwd(),
  'tests/playtest/star-track-deep-playtest.mjs'
);
const LIB = resolve(process.cwd(), 'tests/playtest/star-track-end-status.mjs');

describe('isStarTrackEndWinStatus (q-mp-1483)', () => {
  it('accepts live HvA / seat win banners (stubbed status strings)', () => {
    expect(isStarTrackEndWinStatus('🎉 🔵 You Wins! 🎉')).toBe(true);
    expect(isStarTrackEndWinStatus('🎉 You Wins! 🎉')).toBe(true);
    expect(isStarTrackEndWinStatus('You Wins!')).toBe(true);
    expect(isStarTrackEndWinStatus('AI Wins!')).toBe(true);
    expect(isStarTrackEndWinStatus('Blue Wins!')).toBe(true);
    expect(isStarTrackEndWinStatus('Red Wins!')).toBe(true);
  });

  it('rejects the historical singular You Win! false-negative shape', () => {
    // Live product uses Wins; the old harness arm "You Win!" must not be
    // the only human-win path (measured: /You Win!/i misses "You Wins!").
    expect(
      /(You Win!|AI Wins!|Blue Wins!|Red Wins!)/i.test('🎉 You Wins! 🎉')
    ).toBe(false);
    expect(isStarTrackEndWinStatus('🎉 You Wins! 🎉')).toBe(true);
  });

  it('ignores mid-game turn / thinking / draw copy', () => {
    expect(
      isStarTrackEndWinStatus("Blue's turn - Draw chains from the bucket")
    ).toBe(false);
    expect(isStarTrackEndWinStatus('🤖 Computer is thinking…')).toBe(false);
    expect(isStarTrackEndWinStatus("It's a draw!")).toBe(false);
    expect(isStarTrackEndWinStatus('')).toBe(false);
    expect(isStarTrackEndWinStatus(null)).toBe(false);
  });

  it('keeps RE built from the exported source string', () => {
    expect(STAR_TRACK_END_WIN_STATUS_RE.source).toBe(
      STAR_TRACK_END_WIN_STATUS_RE_SOURCE
    );
    expect(STAR_TRACK_END_WIN_STATUS_RE_SOURCE).toContain('You Wins!');
    expect(STAR_TRACK_END_WIN_STATUS_RE_SOURCE).not.toMatch(/You Win!/);
  });
});

describe('star-track-deep-playtest harness wiring (q-mp-1483)', () => {
  it('imports end-win matcher + RE_SOURCE; no singular You Win! status arm', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/star-track-end-status\.mjs['"]/);
    expect(src).toMatch(/isStarTrackEndWinStatus/);
    expect(src).toMatch(/STAR_TRACK_END_WIN_STATUS_RE_SOURCE/);
    // Historical singular human-win arm must be gone from status matching.
    expect(src).not.toMatch(/You Win!\|AI Wins!/);
    expect(src).not.toMatch(/\(You Win!\|/);

    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/You Wins!\|AI Wins!\|Blue Wins!\|Red Wins!/);
    expect(libSrc).toMatch(/isStarTrackEndWinStatus/);
  });
});
