/**
 * Wave 42 — Par 55 placeBlock empty-hand score settle leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import { type Par55State } from '../../src/games/par-55/types';

describe('Wave 42 par55 — placeBlock empty-hand settle', () => {
  it('last block for both players ends game with higher score winner', () => {
    let state = createInitialState();
    const lastBlock = state.hands.player1[0];
    state = selectBlock(state, lastBlock.id);
    const baseId = getValidPlacements(state)[0];

    const primed: Par55State = {
      ...state,
      hands: {
        player1: [lastBlock],
        player2: [],
      },
      scores: { player1: 30, player2: 25 },
    };

    const next = placeBlock(primed, baseId);
    expect(next.hands.player1).toHaveLength(0);
    expect(next.hands.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('empty-hand tie yields null winner', () => {
    let state = createInitialState();
    const lastBlock = state.hands.player1[0];
    state = selectBlock(state, lastBlock.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, lastBlock, baseId);

    const primed: Par55State = {
      ...state,
      hands: {
        player1: [lastBlock],
        player2: [],
      },
      scores: { player1: 20 - preview.totalPoints, player2: 20 },
    };

    const next = placeBlock(primed, baseId);
    expect(next.hands.player1).toHaveLength(0);
    expect(next.scores.player1).toBe(next.scores.player2);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('player2 wins settle when trailing hand empties with higher score', () => {
    let state = createInitialState();
    state = {
      ...state,
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    const lastBlock = state.hands.player2[0];
    state = selectBlock(state, lastBlock.id);
    const baseId = getValidPlacements(state)[0];

    const primed: Par55State = {
      ...state,
      hands: {
        player1: [],
        player2: [lastBlock],
      },
      scores: { player1: 18, player2: 22 },
    };

    const next = placeBlock(primed, baseId);
    expect(next.hands.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });

  it('single remaining block still records move history', () => {
    let state = createInitialState();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const primed: Par55State = {
      ...state,
      hands: { player1: [block], player2: [] },
      scores: { player1: 10, player2: 5 },
    };
    const next = placeBlock(primed, baseId);
    expect(next.moveHistory.length).toBe(1);
    expect(next.moveHistory[0].block.id).toBe(block.id);
  });
});
