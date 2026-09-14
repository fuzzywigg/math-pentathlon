/**
 * Overnight TOKENMAXX — Hex-a-Gone AI null phase/seat leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getAISelection, getAIPlacement } from '../../src/games/hex-a-gone/ai';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — AI nulls', () => {
  it('wrong seat/phase return null', () => {
    const s = createInitialState();
    expect(getAISelection(s, 'player2', 'easy')).toBeNull();
    expect(getAIPlacement(s, 'player1', 'easy')).toBeNull(); // wrong phase
    let p = selectBlock(s, 'triangle');
    p = commitSelection(p);
    expect(getAISelection(p, 'player1', 'easy')).toBeNull();
  });
});
