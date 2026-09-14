/**
 * Wave 46 — Kwatro clearSelection mid-dest leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 46 kwatro — clear mid', () => {
  it('clear from selectingDest returns selectingChip', () => {
    const sel = selectChip(createInitialState(), 'p1-1');
    expect(sel.phase).toBe('selectingDest');
    const cleared = clearSelection(sel);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();
  });
});
