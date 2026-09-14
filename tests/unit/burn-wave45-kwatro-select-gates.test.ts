/**
 * Wave 45 — Kwatro selectChip gates leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, clearSelection } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — select gates', () => {
  it('select own chip with moves → selectingDest; clear resets', () => {
    const state = createInitialState();
    const sel = selectChip(state, 'p1-2');
    expect(sel.phase).toBe('selectingDest');
    expect(sel.selectedChip).toBe('p1-2');
    const cleared = clearSelection(sel);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();
  });

  it('reject opponent chip and wrong phase', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);
    const sel = selectChip(state, 'p1-0');
    expect(selectChip(sel, 'p1-1')).toBe(sel);
  });
});
