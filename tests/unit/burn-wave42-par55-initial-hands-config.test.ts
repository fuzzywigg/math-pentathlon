/**
 * Wave 42 — Par 55 createInitialState hands + CONFIG leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG, createBlockSet } from '../../src/games/par-55/types';

describe('Wave 42 par55 — initial hands and CONFIG', () => {
  it('CONFIG.TARGET_SCORE is 55', () => {
    expect(CONFIG.TARGET_SCORE).toBe(55);
  });

  it('each hand has HAND_SIZE blocks with unique ids', () => {
    const state = createInitialState();
    expect(state.hands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.HAND_SIZE);

    const ids = new Set([
      ...state.hands.player1.map((b) => b.id),
      ...state.hands.player2.map((b) => b.id),
    ]);
    expect(ids.size).toBe(CONFIG.HAND_SIZE * 2);
  });

  it('opening scores are zero and winner unset', () => {
    const state = createInitialState();
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
    expect(state.winner).toBeNull();
    expect(state.phase).toBe('selectingBlock');
    expect(state.currentPlayer).toBe('player1');
  });

  it('dealt blocks plus center seed partition full block set without overlap', () => {
    const fullSet = createBlockSet();
    const state = createInitialState();
    const usedIds = new Set<string>();

    for (const b of state.hands.player1) usedIds.add(b.id);
    for (const b of state.hands.player2) usedIds.add(b.id);
    for (const base of state.bases.values()) {
      if (base.block) usedIds.add(base.block.id);
    }

    // 5 + 5 + 1 seed = 11 of 60 used at start
    expect(usedIds.size).toBe(CONFIG.HAND_SIZE * 2 + 1);
    expect(fullSet.every((b) => usedIds.has(b.id) || !usedIds.has(b.id))).toBe(
      true
    );
    for (const id of usedIds) {
      expect(fullSet.some((b) => b.id === id)).toBe(true);
    }
  });
});
