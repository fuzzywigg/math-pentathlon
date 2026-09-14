/**
 * Wave 45 TOKENMAXX — Kwatro clearSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — clearSelection', () => {
  it('returns to selectingChip', () => {
    const open = createInitialState();
    const selected = selectChip(open, 'p1-0');
    expect(selected.phase).toBe('selectingDest');
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();
  });
});
