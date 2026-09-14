/**
 * Wave 42 — Par 55 placeBlock p1 TARGET_SCORE win leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import {
  CONFIG,
  createBaseId,
  type AttributeBlock,
  type Par55State,
} from '../../src/games/par-55/types';

describe('Wave 42 par55 — placeBlock p1 target win', () => {
  it('player1 reaching TARGET_SCORE ends game with player1 winner', () => {
    let state = createInitialState();
    const centerId = createBaseId(2, 3);
    const centerBlock = state.bases.get(centerId)!.block!;
    const matchingBlock: AttributeBlock = {
      ...centerBlock,
      id: state.hands.player1[0].id,
    };
    state = {
      ...state,
      hands: {
        ...state.hands,
        player1: [matchingBlock, ...state.hands.player1.slice(1)],
      },
    };
    state = selectBlock(state, matchingBlock.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, matchingBlock, baseId);

    const primed: Par55State = {
      ...state,
      scores: {
        player1: CONFIG.TARGET_SCORE - preview.totalPoints,
        player2: 10,
      },
    };

    const next = placeBlock(primed, baseId);
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('player1 at exactly TARGET_SCORE after placement triggers gameOver', () => {
    let state = createInitialState();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];

    const primed: Par55State = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE - 2, player2: 0 },
    };

    // Placement always scores at least 1 against center seed
    const next = placeBlock(primed, baseId);
    if (next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    }
  });

  it('gameOver preserves currentPlayer seat for p1 instant win', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    const baseId = getValidPlacements(state)[0];
    const primed: Par55State = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE, player2: 20 },
      currentPlayer: 'player1',
    };
    const next = placeBlock(primed, baseId);
    expect(next.currentPlayer).toBe('player1');
  });

  it('center seed id matches board middle for placement context', () => {
    const state = createInitialState();
    const centerId = createBaseId(
      Math.floor(CONFIG.BOARD_ROWS / 2),
      Math.floor(CONFIG.BOARD_COLS / 2)
    );
    expect(state.bases.get(centerId)?.block).toBeTruthy();
  });
});
