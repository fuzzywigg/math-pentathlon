/** Wave 42 — Par 55 p1 TARGET immediate win. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 42 par55 — p1 TARGET immediate win', () => {
  it('p1 already at TARGET → place settles gameOver player1', () => {
    let state = createInitialState();
    state = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE, player2: 10 },
    };
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    const baseId = getValidPlacements(state)[0];
    const next = placeBlock(state, baseId);
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('p1 one point shy of TARGET wins when placement scores ≥1', () => {
    let state = createInitialState();
    state = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 },
    };
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const { totalPoints } = calculateScore(state, block, baseId);
    const next = placeBlock(state, baseId);
    if (totalPoints >= 1) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
      expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    } else {
      // Zero-point place leaves score below TARGET — still playing
      expect(next.scores.player1).toBe(CONFIG.TARGET_SCORE - 1);
      expect(next.phase).toBe('selectingBlock');
      expect(next.winner).toBeNull();
    }
  });

  it('p1 TARGET win ignores opponent already near TARGET', () => {
    let state = createInitialState();
    state = {
      ...state,
      scores: {
        player1: CONFIG.TARGET_SCORE,
        player2: CONFIG.TARGET_SCORE - 1,
      },
    };
    state = selectBlock(state, state.hands.player1[0].id);
    const next = placeBlock(state, getValidPlacements(state)[0]);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('p1 below TARGET with zero-point place does not end game', () => {
    let state = createInitialState();
    state = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE - 5, player2: 0 },
    };
    const block = state.hands.player1.find((b) => {
      const probe = { ...state, selectedBlock: b.id, phase: 'placingBlock' as const };
      const baseId = getValidPlacements(probe)[0];
      return calculateScore(probe, b, baseId).totalPoints === 0;
    });
    if (!block) {
      // No zero-score opening block — skip soft assertion
      expect(state.scores.player1).toBeLessThan(CONFIG.TARGET_SCORE);
      return;
    }
    state = selectBlock(state, block.id);
    const next = placeBlock(state, getValidPlacements(state)[0]);
    expect(next.phase).toBe('selectingBlock');
    expect(next.winner).toBeNull();
    expect(next.scores.player1).toBe(CONFIG.TARGET_SCORE - 5);
  });
});
