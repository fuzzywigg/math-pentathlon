/**
 * Wave 43 — Hex-a-Gone getPhaseMessage Blue/Red matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  getPhaseMessage,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — phase messages', () => {
  it('select / place / gameOver messages name seats', () => {
    const open = createInitialState();
    expect(getPhaseMessage(open)).toContain('Blue');
    expect(getPhaseMessage(open)).toContain('Select');

    let selected = selectBlock(open, 'triangle');
    expect(getPhaseMessage(selected)).toContain('1 block');

    selected = commitSelection(selected);
    expect(getPhaseMessage(selected)).toContain('Place');

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(over)).toBe('Red wins!');
  });
});
