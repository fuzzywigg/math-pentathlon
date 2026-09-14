/**
 * Wave 45 — Kwatro opening chip placement leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { PLAYER_CHIPS } from '../../src/games/kwatro-sinko/types';

describe('Wave 45 kwatro — opening chips', () => {
  it('p1 evens on row0; p2 odds on row4', () => {
    const state = createInitialState();
    expect(state.chips.size).toBe(10);
    PLAYER_CHIPS.player1.forEach((v, i) => {
      expect(state.chips.get(`p1-${i}`)?.value).toBe(v);
      expect(state.chips.get(`p1-${i}`)?.position).toBe(`n0-${i}`);
    });
    PLAYER_CHIPS.player2.forEach((v, i) => {
      expect(state.chips.get(`p2-${i}`)?.value).toBe(v);
      expect(state.chips.get(`p2-${i}`)?.position).toBe(`n4-${i}`);
    });
  });
});
