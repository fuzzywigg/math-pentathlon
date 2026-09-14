/**
 * Overnight TOKENMAXX — Hex-a-Gone passTurn selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, passTurn } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — pass gates', () => {
  it('with selection identity; empty flips seat', () => {
    const s = createInitialState();
    const withSel = selectBlock(s, 'triangle');
    expect(passTurn(withSel)).toBe(withSel);
    const next = passTurn(s);
    expect(next.currentPlayer).toBe('player2');
  });
});
