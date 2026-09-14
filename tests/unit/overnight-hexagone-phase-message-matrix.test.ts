/**
 * Overnight TOKENMAXX — Hex-a-Gone getPhaseMessage leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getPhaseMessage, selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — phase messages', () => {
  it('select / selected / gameOver messages', () => {
    const s = createInitialState();
    expect(getPhaseMessage(s)).toMatch(/Select 1-3/i);
    const sel = selectBlock(s, 'triangle');
    expect(getPhaseMessage(sel)).toMatch(/1 block/i);
    expect(
      getPhaseMessage({ ...s, phase: 'gameOver', winner: 'player1' })
    ).toMatch(/Blue wins/i);
  });
});
