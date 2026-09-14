/**
 * Wave 43 — Sum Dominoes double-pass pip tie → winner null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';
import type { Domino, SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — pip-tie double pass', () => {
  it('equal remaining pips → winner null', () => {
    const stuck: SumDominoesState = {
      ...createInitialState(),
      phase: 'passing',
      passCount: 1,
      hands: {
        player1: [makeDomino('a', 3, 3)],
        player2: [makeDomino('b', 2, 4, 'player2')],
      },
    };
    const next = passTurn(stuck);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
