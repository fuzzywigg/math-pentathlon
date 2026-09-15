/**
 * Wave 67 leftover after tip/#324 — Kwatro numbered empty stroke-width 2.
 * Soft #e8e8e8/#999; deepen stroke-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 67 kwatro — render numbered stroke-width 2', () => {
  it('vacated numbered start node uses #e8e8e8 stroke-width 2', () => {
    let state = createInitialState();
    state = selectChip(state, 'p1-0');
    const dest = [...state.nodes.values()].find(
      (n) => !n.chip && state.selectedChip && n.connections.includes('n0-0')
    );
    expect(dest).toBeTruthy();
    state = moveChip(state, dest!.id);
    const el = renderBoard(state, () => undefined, () => undefined);
    const emptyNumbered = [...state.nodes.values()].find(
      (n) => n.isNumbered && !n.chip
    );
    expect(emptyNumbered).toBeTruthy();
    const circle = el.querySelector(
      `[data-node-id="${emptyNumbered!.id}"] > circle`
    );
    expect(circle?.getAttribute('fill')).toBe('#e8e8e8');
    expect(circle?.getAttribute('stroke')).toBe('#999');
    expect(circle?.getAttribute('stroke-width')).toBe('2');
  });
});
