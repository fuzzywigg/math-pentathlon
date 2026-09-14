/**
 * Wave 42 — Kings pieces factory + INITIAL_QUADRAPHAGE_COUNT leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createKing,
  createQuadraphage,
  INITIAL_QUADRAPHAGE_COUNT,
} from '../../src/games/kings-quadraphages/pieces';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { createInitialGameState as createBoardState } from '../../src/games/kings-quadraphages/board';

describe('Wave 42 kings — pieces factories', () => {
  it('createKing / createQuadraphage set type+owner', () => {
    expect(createKing('player1')).toEqual({
      type: 'king',
      owner: 'player1',
    });
    expect(createQuadraphage('player2')).toEqual({
      type: 'quadraphage',
      owner: 'player2',
    });
  });

  it('INITIAL_QUADRAPHAGE_COUNT is 30 and matches opening supplies', () => {
    expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
    const gs = createInitialGameState();
    const board = createBoardState();
    expect(gs.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(board.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
  });

  it('factories are distinct object identities', () => {
    const a = createKing('player1');
    const b = createKing('player1');
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
