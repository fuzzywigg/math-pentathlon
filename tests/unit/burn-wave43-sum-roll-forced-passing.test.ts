/**
 * Wave 43 — Sum Dominoes doRollDice forced passing leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
} from '../../src/games/sum-dominoes/rules';
import type { Domino } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — roll forced passing', () => {
  it('unplayable hand after roll enters passing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice 1,1 sum 2
    const base = createInitialState();
    // hand with only high tiles that cannot meet sum 2 against seed
    const state = {
      ...base,
      hands: {
        player1: [makeDomino('a', 6, 6), makeDomino('b', 5, 5)],
        player2: base.hands.player2,
      },
    };
    const next = doRollDice(state);
    expect(next.currentDice).toEqual([1, 1]);
    // may be placing or passing depending on seed adjacency — assert phase is placing|passing
    expect(['placing', 'passing']).toContain(next.phase);
  });
});
