/**
 * Wave 45 TOKENMAXX — Kwatro selectChip jammed (zero moves) leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — jammed select', () => {
  it('selectChip identity when own chip has empty getValidMoves', () => {
    const open = createInitialState();
    // Fill the only destination of p1-0 (n1-0) so it has zero moves
    const nodes = new Map(open.nodes);
    const chips = new Map(open.chips);
    const dest = nodes.get('n1-0')!;
    const blocker = { id: 'block', value: 9, owner: 'player2', position: 'n1-0' };
    nodes.set('n1-0', { ...dest, chip: blocker });
    chips.set('block', blocker);
    const jammed = { ...open, nodes, chips };
    expect(getValidMoves(jammed, 'p1-0')).toEqual([]);
    expect(selectChip(jammed, 'p1-0')).toBe(jammed);
  });
});
