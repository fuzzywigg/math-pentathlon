/**
 * Wave 45 TOKENMAXX — Par-55 clearSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  clearSelection,
} from '../../src/games/par-55/rules';

describe('Wave 45 par55 — clearSelection', () => {
  it('returns to selectingBlock with null selection', () => {
    const open = createInitialState();
    const selected = selectBlock(open, open.hands.player1[0].id);
    expect(selected.phase).toBe('placingBlock');
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();
  });
});
