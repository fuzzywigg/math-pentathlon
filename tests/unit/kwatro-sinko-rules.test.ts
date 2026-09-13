import { describe, it, expect } from 'vitest';
import { isWinningValue } from '../../src/games/kwatro-sinko/types';
import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';

describe('Kwatro-Sinko – isWinningValue', () => {
  it('accepts 4 and 5 only', () => {
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);
    expect(isWinningValue(6)).toBe(false);
  });
});

describe('Kwatro-Sinko – selectChip / getValidMoves / moveChip', () => {
  it('selectChip selects an own chip with empty destinations', () => {
    const state = createInitialState();
    // Corner chips on top row connect into the open middle
    const chipId = 'p1-0';
    const moves = getValidMoves(state, chipId);
    expect(moves.length).toBeGreaterThan(0);

    const selected = selectChip(state, chipId);
    expect(selected.selectedChip).toBe(chipId);
    expect(selected.phase).toBe('selectingDest');
  });

  it('selectChip rejects opponent chips', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);
  });

  it('moveChip relocates the chip and clears selection', () => {
    const state = createInitialState();
    const chipId = 'p1-2';
    const destinations = getValidMoves(state, chipId);
    expect(destinations.length).toBeGreaterThan(0);

    let next = selectChip(state, chipId);
    const dest = destinations[0];
    next = moveChip(next, dest);

    expect(next.chips.get(chipId)?.position).toBe(dest);
    expect(next.nodes.get(dest)?.chip?.id).toBe(chipId);
    expect(next.nodes.get('n0-2')?.chip).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('selectingChip');
      expect(next.selectedChip).toBeNull();
    }
  });

  it('illegal occupied destination is a no-op', () => {
    const state = createInitialState();
    // All top-row nodes start occupied by p1 chips
    let next = selectChip(state, 'p1-0');
    const before = next;
    next = moveChip(next, 'n0-1'); // occupied by p1-1
    expect(next).toBe(before);
    expect(next.chips.get('p1-0')?.position).toBe('n0-0');
  });

  it('clearSelection returns to selectingChip', () => {
    const state = selectChip(createInitialState(), 'p1-0');
    const cleared = clearSelection(state);
    expect(cleared.selectedChip).toBeNull();
    expect(cleared.phase).toBe('selectingChip');
  });
});
