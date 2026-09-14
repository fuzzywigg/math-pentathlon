/**
 * Wave 43 — getLastMoveInfo capture+freeTurn combined leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 43 calla — last move capture and free', () => {
  it('forged history with capture and freeTurn includes both phrases', () => {
    const state = {
      ...createInitialState(),
      moveHistory: [
        {
          player: 'player1' as const,
          pitIndex: 2,
          cubesDistributed: 3,
          captured: 4,
          gotFreeTurn: true,
          moveNumber: 1,
        },
      ],
    };
    const info = getLastMoveInfo(state);
    expect(info).toContain('captured 4');
    expect(info).toContain('Free turn');
  });

  it('empty history returns null', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();
  });
});
