/**
 * Wave 68 leftover after tip/#336 — Kwatro opening phase and currentPlayer.
 * Chip counts covered; deepen phase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 68 kwatro — rules opening phase player', () => {
  it('opening is selectingChip for player1', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingChip');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedChip).toBeNull();
    expect(state.winner).toBeNull();
  });
});
