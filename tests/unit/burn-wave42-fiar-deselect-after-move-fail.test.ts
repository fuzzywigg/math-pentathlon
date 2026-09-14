/**
 * Wave 42 — FIAR illegal moveChip keeps selection path via deselect. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  placeChip,
  selectChip,
  moveChip,
  deselectChip,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

describe('Wave 42 fiar — illegal move identity', () => {
  it('bad moveChip identity; deselect clears selection', () => {
    let s = createInitialState();
    for (const id of ['0-0', '0-4', '1-0', '1-4', '2-0', '2-4', '3-0', '3-4']) {
      s = placeChip(s, id);
    }
    const id = getSelectableNodes(s)[0];
    s = selectChip(s, id);
    expect(s.selectedNode).toBe(id);
    expect(moveChip(s, id, '99-99')).toBe(s);
    expect(deselectChip(s).selectedNode).toBeNull();
  });
});
