/**
 * Wave 42 — FIAR illegal moveChip keeps selection path via deselect. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  selectChip,
  moveChip,
  deselectChip,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { placeToMovement } from './fiar-test-helpers';

describe('Wave 42 fiar — illegal move identity', () => {
  it('bad moveChip identity; deselect clears selection', () => {
    let s = placeToMovement();
    const id = getSelectableNodes(s)[0];
    s = selectChip(s, id);
    expect(s.selectedNode).toBe(id);
    expect(moveChip(s, id, '99-99')).toBe(s);
    expect(deselectChip(s).selectedNode).toBeNull();
  });
});
