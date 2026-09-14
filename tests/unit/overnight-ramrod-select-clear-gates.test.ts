/**
 * Overnight HEAVY after #214/#215 — Ramrod select/clear gates leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod, clearSelection } from '../../src/games/ramrod/rules';

describe('Overnight ramrod — select/clear', () => {
  it('own rod enters placingRod; clear returns selectingRod', () => {
    const s = createInitialState();
    const own = s.playerRods.player1[0];
    const opp = s.playerRods.player2[0];
    expect(selectRod(s, opp)).toBe(s);
    const selected = selectRod(s, own);
    expect(selected.phase).toBe('placingRod');
    expect(selected.selectedRod).toBe(own);
    const cleared = clearSelection(selected);
    expect(cleared.selectedRod).toBeNull();
    expect(cleared.phase).toBe('selectingRod');
  });
});
