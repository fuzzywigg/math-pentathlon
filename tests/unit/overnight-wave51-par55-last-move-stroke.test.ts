/**
 * Overnight HEAVY leftovers after #234 — Par55 last-move orange stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — last-move stroke', () => {
  it('uses #ff9800 stroke width 3 on lastMoveBaseId', () => {
    let state = createInitialState();
    const blockId = state.hands.player1[0]!.id;
    state = selectBlock(state, blockId);
    const target = getValidPlacements(state)[0];
    expect(target).toBeTruthy();
    state = placeBlock(state, target!);
    expect(state.lastMoveBaseId).toBe(target);
    const el = renderBoard(state, () => undefined);
    const g = el.querySelector(`[data-base-id="${target}"]`)!;
    const pent = g.querySelector('polygon')!;
    expect(pent.getAttribute('stroke')).toBe('#ff9800');
    expect(pent.getAttribute('stroke-width')).toBe('3');
  });
});
