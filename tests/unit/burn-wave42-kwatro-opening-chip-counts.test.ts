/**
 * Wave 42 — Kwatro-Sinko PLAYER_CHIPS catalog and opening placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { CONFIG, PLAYER_CHIPS } from '../../src/games/kwatro-sinko/types';

describe('Wave 42 kwatro-sinko — opening chip counts', () => {
  it('CONFIG and PLAYER_CHIPS agree on five chips per side', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(5);
    expect(PLAYER_CHIPS.player1).toHaveLength(5);
    expect(PLAYER_CHIPS.player2).toHaveLength(5);
  });

  it('player1 even values sit on the top numbered row', () => {
    const { nodes, chips } = createInitialState();
    PLAYER_CHIPS.player1.forEach((value, index) => {
      const chip = chips.get(`p1-${index}`);
      expect(chip?.value).toBe(value);
      expect(chip?.owner).toBe('player1');
      expect(chip?.position).toBe(`n0-${index}`);
      expect(nodes.get(`n0-${index}`)?.chip?.id).toBe(`p1-${index}`);
    });
  });

  it('player2 odd values sit on the bottom numbered row', () => {
    const { nodes, chips } = createInitialState();
    PLAYER_CHIPS.player2.forEach((value, index) => {
      const chip = chips.get(`p2-${index}`);
      expect(chip?.value).toBe(value);
      expect(chip?.owner).toBe('player2');
      expect(chip?.position).toBe(`n4-${index}`);
      expect(nodes.get(`n4-${index}`)?.chip?.id).toBe(`p2-${index}`);
    });
  });

  it('ten chips total and opening seat is player1', () => {
    const state = createInitialState();
    expect(state.chips.size).toBe(10);
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedChip).toBeNull();
  });
});
