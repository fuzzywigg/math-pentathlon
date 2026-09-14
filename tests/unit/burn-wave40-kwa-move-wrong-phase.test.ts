/**
 * Wave 40 — Kwatro-sinko moveChip wrong phase + isValidMove ghost + clearSelection.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  moveChip,
  isValidMove,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 40 kwa — move wrong phase / ghost / clear', () => {
  it('moveChip identity when phase selectingChip / no selectedChip', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingChip');
    expect(state.selectedChip).toBeNull();
    const next = moveChip(state, 'n1-0');
    expect(next).toBe(state);
  });

  it('isValidMove false for ghost destination', () => {
    const state = createInitialState();
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    expect(isValidMove(state, chip.id, 'ghost-node')).toBe(false);
  });

  it('clearSelection resets phase to selectingChip', () => {
    let state = createInitialState();
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    state = selectChip(state, chip.id);
    expect(state.phase).toBe('selectingDest');
    expect(state.selectedChip).toBe(chip.id);

    state = clearSelection(state);
    expect(state.selectedChip).toBeNull();
    expect(state.phase).toBe('selectingChip');
  });
});
