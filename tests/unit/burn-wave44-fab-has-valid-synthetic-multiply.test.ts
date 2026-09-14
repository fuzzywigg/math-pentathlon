/**
 * Wave 44 overnight HEAVY — Fab hasAnyValidMove synthetic multiply path.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasAnyValidMove } from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab — hasValid multiply', () => {
  it('1/2 × 1/2 → 1/4 answer', () => {
    const s = createInitialState();
    const bars = new Map<string, FractionBar>([
      ['a', { id: 'a', fraction: { numerator: 1, denominator: 2 }, owner: null, used: false }],
      ['b', { id: 'b', fraction: { numerator: 1, denominator: 2 }, owner: null, used: false }],
    ]);
    const answers = new Map(s.answerBars);
    // ensure 1/4 exists unclaimed
    let hasQuarter = false;
    for (const a of answers.values()) {
      if (a.fraction.numerator === 1 && a.fraction.denominator === 4) hasQuarter = true;
    }
    if (!hasQuarter) {
      answers.set('q', { id: 'q', fraction: { numerator: 1, denominator: 4 }, claimedBy: null });
    }
    const syn: FabADiffyState = { ...s, fractionBars: bars, answerBars: answers };
    expect(hasAnyValidMove(syn)).toBe(true);
  });
});
