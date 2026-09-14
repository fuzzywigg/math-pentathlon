/**
 * Overnight TOKENMAXX — Calla getLastMoveInfo leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getLastMoveInfo } from '../../src/games/calla/rules';

describe('Overnight calla — last move info', () => {
  it('null empty; singular cube; capture; free turn', () => {
    const s = createInitialState();
    expect(getLastMoveInfo(s)).toBeNull();
    const withHist = {
      ...s,
      moveHistory: [
        {
          player: 'player1' as const,
          pitIndex: 0,
          cubesDistributed: 1,
          captured: 0,
          gotFreeTurn: false,
        },
      ],
    };
    expect(getLastMoveInfo(withHist)).toMatch(/1 cube(?!s)/);
    const cap = {
      ...s,
      moveHistory: [
        {
          player: 'player2' as const,
          pitIndex: 1,
          cubesDistributed: 3,
          captured: 4,
          gotFreeTurn: true,
        },
      ],
    };
    const info = getLastMoveInfo(cap)!;
    expect(info).toMatch(/Red/);
    expect(info).toMatch(/captured 4/);
    expect(info).toMatch(/Free turn/);
  });
});
