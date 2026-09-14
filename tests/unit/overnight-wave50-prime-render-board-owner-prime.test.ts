/**
 * Overnight HEAVY leftover after #229 — Prime Gold owned + prime cell classes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — owner/prime classes', () => {
  it('marks owned cells with player class and keeps prime class', () => {
    const state = createInitialState();
    const cell = state.cells.get('0,0');
    expect(cell).toBeTruthy();
    if (!cell) return;
    state.cells.set('0,0', { ...cell, owner: 'player1', isPrime: true });
    const el = renderBoard(state, () => undefined);
    const owned = el.querySelector('.pg-cell[data-row="0"][data-col="0"]');
    expect(owned?.classList.contains('player1')).toBe(true);
    expect(owned?.classList.contains('prime')).toBe(true);
  });
});
