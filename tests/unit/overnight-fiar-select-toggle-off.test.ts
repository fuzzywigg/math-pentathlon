/**
 * Overnight TOKENMAXX — FIAR selectChip toggle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import {
  placeChip,
  getSelectableNodes,
  selectChip,
  deselectChip,
} from '../../src/games/fiar/rules';

describe('Overnight fiar — select toggle', () => {
  it('select twice clears; deselect clears', () => {
    let s = createInitialState();
    const nodes = ['0-0', '0-1', '0-2', '0-3', '1-0', '1-1', '1-2', '1-3'];
    for (const n of nodes) s = placeChip(s, n);
    const selectable = getSelectableNodes(s);
    expect(selectable.length).toBeGreaterThan(0);
    const id = selectable[0];
    s = selectChip(s, id);
    expect(s.selectedNode).toBe(id);
    s = selectChip(s, id);
    expect(s.selectedNode).toBeNull();
    s = selectChip(s, id);
    s = deselectChip(s);
    expect(s.selectedNode).toBeNull();
  });
});
