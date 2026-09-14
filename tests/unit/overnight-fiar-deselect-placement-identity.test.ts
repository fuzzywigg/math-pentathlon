/**
 * Overnight TOKENMAXX — FIAR deselect in placement leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { deselectChip } from '../../src/games/fiar/rules';

describe('Overnight fiar — deselect placement', () => {
  it('deselect on placement with null selection is identity-like', () => {
    const s = createInitialState();
    const next = deselectChip(s);
    expect(next.selectedNode).toBeNull();
    expect(next.phase).toBe('placement');
  });
});
