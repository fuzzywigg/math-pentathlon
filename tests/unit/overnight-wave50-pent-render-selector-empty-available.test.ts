/**
 * Overnight HEAVY leftover after #229 — Pent selector empty available tray. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderPieceSelector } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — selector empty', () => {
  it('renders no options when current player has empty available', () => {
    const state = createInitialState();
    state.player1Pieces = { available: [], placed: ['F', 'I5'] };
    const el = renderPieceSelector(state, () => undefined);
    expect(el.querySelectorAll('.pent-piece-option').length).toBe(0);
  });
});
