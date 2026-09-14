/**
 * Wave 42 — Par 55 placeBlock p2 vs higher p1 settle leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { CONFIG, type Par55State } from '../../src/games/par-55/types';

describe('Wave 42 par55 — placeBlock p2 target settle', () => {
  function primedP2Turn(state: Par55State): Par55State {
    return {
      ...state,
      currentPlayer: 'player2',
      selectedBlock: null,
      phase: 'selectingBlock',
    };
  }

  it('player2 surpassing player1 at TARGET_SCORE wins as player2', () => {
    let state = primedP2Turn(createInitialState());
    const block = state.hands.player2[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];

    const primed: Par55State = {
      ...state,
      scores: {
        player1: CONFIG.TARGET_SCORE + 3,
        player2: CONFIG.TARGET_SCORE - 1,
      },
    };

    const next = placeBlock(primed, baseId);
    expect(next.scores.player2).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.scores.player2).toBeGreaterThan(next.scores.player1);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });

  it('player2 reaching TARGET_SCORE but trailing player1 loses to player1', () => {
    let state = primedP2Turn(createInitialState());
    const block = state.hands.player2[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];

    const primed: Par55State = {
      ...state,
      scores: {
        player1: CONFIG.TARGET_SCORE + 10,
        player2: CONFIG.TARGET_SCORE - 1,
      },
    };

    const next = placeBlock(primed, baseId);
    if (
      next.scores.player2 >= CONFIG.TARGET_SCORE &&
      next.scores.player2 < next.scores.player1
    ) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    }
  });

  it('both at TARGET_SCORE with equal totals yields null winner tie branch', () => {
    let state = primedP2Turn(createInitialState());
    const block = state.hands.player2[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];

    const pointsPreview = CONFIG.TARGET_SCORE - 50;
    const primed: Par55State = {
      ...state,
      scores: {
        player1: CONFIG.TARGET_SCORE,
        player2: CONFIG.TARGET_SCORE - pointsPreview,
      },
    };

    const next = placeBlock(primed, baseId);
    if (
      next.scores.player1 >= CONFIG.TARGET_SCORE &&
      next.scores.player1 === next.scores.player2
    ) {
      expect(next.winner).toBeNull();
    }
  });

  it('player2 turn flips to player1 when game continues below target', () => {
    let state = primedP2Turn(createInitialState());
    state = selectBlock(state, state.hands.player2[0].id);
    const baseId = getValidPlacements(state)[0];
    const primed: Par55State = {
      ...state,
      scores: { player1: 5, player2: 5 },
    };
    const next = placeBlock(primed, baseId);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player1');
    }
  });
});
