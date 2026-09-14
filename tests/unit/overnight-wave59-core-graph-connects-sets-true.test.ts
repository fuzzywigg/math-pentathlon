/**
 * Overnight HEAVY leftover after #280 — playerConnectsSets success corridor.
 * Opposite of wave52/53 connects false leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  playerConnectsSets,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 59 core graph — connects sets true', () => {
  it('owned corridor connects endpoint sets', () => {
    const graph = createTrackGraph(4);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 1 }],
        ['t3', { owner: 1 }],
      ]),
    };
    expect(playerConnectsSets(board, 1, ['t0'], ['t3'])).toBe(true);
  });
});
