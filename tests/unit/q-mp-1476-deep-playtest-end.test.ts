/**
 * Hermetic coverage for q-mp-1476 (non-banner tie/wins/draw false-ends).
 * Pure matcher asserts — safe under unit-shared jsdom (no vitest.config edit).
 */
import { describe, it, expect } from 'vitest';
import {
  DRAW_RE_SOURCE,
  END_RE_SOURCE,
  TIE_RE_SOURCE,
  isDeepPlaytestDrawStatus,
  isDeepPlaytestEndStatus,
  isDeepPlaytestTieStatus,
} from '../../scripts/lib/deep-playtest-end.mjs';

describe('q-mp-1476 deep-playtest end rejects non-banner tie/wins/draw', () => {
  it('interrogative / No … yet / Please draw / thinking about Draw are not ends', () => {
    expect(isDeepPlaytestEndStatus('No tie yet')).toBe(false);
    expect(isDeepPlaytestDrawStatus('No tie yet')).toBe(false);
    expect(isDeepPlaytestTieStatus('No tie yet')).toBe(false);

    expect(isDeepPlaytestEndStatus('Who wins the round?')).toBe(false);
    expect(isDeepPlaytestEndStatus('who wins?')).toBe(false);
    expect(isDeepPlaytestEndStatus('What wins?')).toBe(false);
    expect(isDeepPlaytestEndStatus('Which wins the heat?')).toBe(false);

    expect(isDeepPlaytestEndStatus('Please draw a card')).toBe(false);
    expect(isDeepPlaytestDrawStatus('Please draw a card')).toBe(false);

    expect(isDeepPlaytestEndStatus('thinking about Draw')).toBe(false);
    expect(isDeepPlaytestDrawStatus('thinking about Draw')).toBe(false);
  });

  it('genuine win / tie / draw banners still detect', () => {
    expect(isDeepPlaytestEndStatus('Blue wins!')).toBe(true);
    expect(isDeepPlaytestEndStatus('Red wins with 24cm!')).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a draw!")).toBe(true);
    expect(isDeepPlaytestDrawStatus("It's a draw!")).toBe(true);
    expect(isDeepPlaytestEndStatus('Game Over! Tie!')).toBe(true);
    expect(isDeepPlaytestDrawStatus('Game Over! Tie!')).toBe(true);
    expect(isDeepPlaytestTieStatus('Game Over! Tie!')).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a Tie!")).toBe(true);
    expect(isDeepPlaytestEndStatus('Draw!')).toBe(true);
    expect(isDeepPlaytestDrawStatus('Draw!')).toBe(true);
    expect(isDeepPlaytestEndStatus("It's a draw! All chains exhausted.")).toBe(
      true
    );
  });

  it('keeps Draw-chains + hyphen lookarounds from 1403/1404', () => {
    expect(isDeepPlaytestEndStatus('Draw chains from the bucket')).toBe(false);
    expect(isDeepPlaytestDrawStatus('Draw chains from the bucket')).toBe(false);
    expect(isDeepPlaytestEndStatus('pre-tie')).toBe(false);
    expect(isDeepPlaytestTieStatus('pre-tie')).toBe(false);
    expect(isDeepPlaytestEndStatus('re-draw')).toBe(false);
    expect(isDeepPlaytestEndStatus('pre-wins')).toBe(false);
    expect(isDeepPlaytestEndStatus('tie-breaker round')).toBe(false);
  });

  it('END_RE_SOURCE / DRAW_RE_SOURCE / TIE_RE_SOURCE stay in sync with helpers', () => {
    const endRe = new RegExp(END_RE_SOURCE, 'i');
    const drawRe = new RegExp(DRAW_RE_SOURCE, 'i');
    const tieRe = new RegExp(TIE_RE_SOURCE, 'i');

    expect(endRe.test('No tie yet')).toBe(false);
    expect(tieRe.test('No tie yet')).toBe(false);
    expect(endRe.test('Who wins the round?')).toBe(false);
    expect(endRe.test('Please draw a card')).toBe(false);
    expect(drawRe.test('Please draw a card')).toBe(false);
    expect(endRe.test('thinking about Draw')).toBe(false);
    expect(drawRe.test('thinking about Draw')).toBe(false);

    expect(endRe.test('Blue wins!')).toBe(true);
    expect(endRe.test("It's a draw!")).toBe(true);
    expect(drawRe.test("It's a draw!")).toBe(true);
    expect(endRe.test('Game Over! Tie!')).toBe(true);
    expect(tieRe.test('Game Over! Tie!')).toBe(true);
    expect(endRe.test('Draw chains')).toBe(false);
    expect(endRe.test('pre-tie')).toBe(false);
  });
});
