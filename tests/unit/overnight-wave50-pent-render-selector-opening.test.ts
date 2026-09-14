/**
 * Overnight HEAVY leftover after #229 — Pent piece selector opening tray. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getPlayerPieces } from '../../src/games/pent-em-in/types';
import { renderPieceSelector } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — selector opening', () => {
  it('renders one option per available piece with labels', () => {
    const state = createInitialState();
    const available = getPlayerPieces(state, 'player1').available;
    const el = renderPieceSelector(state, () => undefined);
    expect(el.classList.contains('pent-piece-selector')).toBe(true);
    const options = el.querySelectorAll('.pent-piece-option');
    expect(options.length).toBe(available.length);
    expect(el.querySelectorAll('.pent-piece-label').length).toBe(available.length);
    expect(el.querySelector('svg')).toBeTruthy();
  });
});
