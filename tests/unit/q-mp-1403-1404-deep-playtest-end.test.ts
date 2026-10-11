/**
 * Hermetic coverage for q-mp-1403 (star-track "Draw chains" false end) and
 * q-mp-1404 (hyphenated draw/tie/wins forms). Pure matcher asserts — safe under
 * unit-shared jsdom (no vitest.config.ts nodePureFiles edit).
 */
import { describe, it, expect } from 'vitest';
import {
  END_RE_SOURCE,
  isDeepPlaytestDrawStatus,
  isDeepPlaytestEndStatus,
  isDeepPlaytestTieStatus,
} from '../../scripts/lib/deep-playtest-end.mjs';

const STAR_TRACK_DRAW_CHAINS =
  "Blue's turn - Draw chains from the bucket" as const;

describe('q-mp-1403 deep-playtest end rejects star-track Draw chains', () => {
  it('mid-game Draw chains copy is not an end or draw', () => {
    expect(isDeepPlaytestEndStatus(STAR_TRACK_DRAW_CHAINS)).toBe(false);
    expect(isDeepPlaytestDrawStatus(STAR_TRACK_DRAW_CHAINS)).toBe(false);
    expect(isDeepPlaytestEndStatus('Draw chains from the bucket')).toBe(false);
    expect(isDeepPlaytestDrawStatus('Draw chains from the bucket')).toBe(false);
    expect(isDeepPlaytestEndStatus('Draw chains')).toBe(false);
    expect(isDeepPlaytestDrawStatus('Draw chains')).toBe(false);
  });

  it('genuine draw / win / tie banners still detect', () => {
    expect(isDeepPlaytestEndStatus("It's a draw!")).toBe(true);
    expect(isDeepPlaytestDrawStatus("It's a draw!")).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a draw! All chains exhausted.")).toBe(
      true
    );
    expect(isDeepPlaytestDrawStatus("It's a draw! All chains exhausted.")).toBe(
      true
    );
    expect(isDeepPlaytestEndStatus('Blue wins!')).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a Tie!")).toBe(true);
    expect(isDeepPlaytestDrawStatus("It's a Tie!")).toBe(true);
    expect(isDeepPlaytestEndStatus('Draw!')).toBe(true);
    expect(isDeepPlaytestDrawStatus('Draw!')).toBe(true);
  });
});

describe('q-mp-1404 deep-playtest end rejects hyphenated draw/tie/wins', () => {
  it('hyphen-prefixed and hyphen-compound forms are not ends', () => {
    expect(isDeepPlaytestEndStatus('pre-tie')).toBe(false);
    expect(isDeepPlaytestDrawStatus('pre-tie')).toBe(false);
    expect(isDeepPlaytestTieStatus('pre-tie')).toBe(false);
    expect(isDeepPlaytestEndStatus('re-draw')).toBe(false);
    expect(isDeepPlaytestDrawStatus('re-draw')).toBe(false);
    expect(isDeepPlaytestEndStatus('pre-wins')).toBe(false);
    expect(isDeepPlaytestEndStatus('tie-breaker round')).toBe(false);
    expect(isDeepPlaytestDrawStatus('tie-breaker round')).toBe(false);
    expect(isDeepPlaytestTieStatus('tie-breaker round')).toBe(false);
  });

  it('space-bounded tie / wins banners unchanged', () => {
    expect(isDeepPlaytestEndStatus("It's a tie")).toBe(true);
    expect(isDeepPlaytestDrawStatus("It's a tie")).toBe(true);
    expect(isDeepPlaytestTieStatus("It's a tie")).toBe(true);
    expect(isDeepPlaytestEndStatus('Blue wins!')).toBe(true);
    expect(isDeepPlaytestEndStatus('Red wins with 24cm!')).toBe(true);
  });

  it('END_RE_SOURCE page-callback body stays in sync with helpers', () => {
    const endRe = new RegExp(END_RE_SOURCE, 'i');
    expect(endRe.test(STAR_TRACK_DRAW_CHAINS)).toBe(false);
    expect(endRe.test('pre-tie')).toBe(false);
    expect(endRe.test('re-draw')).toBe(false);
    expect(endRe.test('pre-wins')).toBe(false);
    expect(endRe.test('tie-breaker round')).toBe(false);
    expect(endRe.test('Blue wins!')).toBe(true);
    expect(endRe.test("It's a draw!")).toBe(true);
    expect(endRe.test("It's a tie")).toBe(true);
  });
});
