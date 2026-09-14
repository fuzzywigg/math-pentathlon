/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone phase messages leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getPhaseMessage, selectBlock, commitSelection, passTurn } from '../../src/games/hex-a-gone/rules';

describe('Overnight hex-a-gone — phase messages', () => {
  it('select/place/gameOver messages are nonempty', () => {
    const s = createInitialState();
    expect(getPhaseMessage(s)).toMatch(/Select/i);
    const placing = commitSelection(selectBlock(s, 'triangle'));
    expect(getPhaseMessage(placing)).toMatch(/Place/i);
    const over = { ...s, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getPhaseMessage(over)).toMatch(/wins/i);
  });

  it('passTurn from selectBlocks flips seat or ends', () => {
    const next = passTurn(createInitialState());
    expect(['selectBlocks', 'gameOver']).toContain(next.phase);
    expect(next.currentPlayer === 'player2' || next.winner !== null).toBe(true);
  });
});
