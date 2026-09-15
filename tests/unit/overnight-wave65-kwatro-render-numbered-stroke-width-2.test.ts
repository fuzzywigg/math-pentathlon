/**
 * Wave 65 leftover after tip/#315 — Kwatro numbered empty stroke-width 2.
 * Soft #e8e8e8/#999 existed; deepen stroke-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render numbered stroke-width 2', () => {
  it('vacated numbered start node uses #e8e8e8 stroke-width 2', () => {
    let state = createInitialState();
    state = selectChip(state, 'p1-0');
    const dest = [...state.nodes.values()].find(
      (n) => !n.chip && state.selectedChip && n.connections.includes('n0-0')
    );
    expect(dest).toBeTruthy();
    state = moveChip(state, dest!.id);
    // pass so board settles; vacated n0-0 is numbered empty
    const el = renderBoard(state, () => undefined, () => undefined);
    // After Blue moved, n0-0 may still be empty numbered
    const vacated = el.querySelector('[data-node-id="n0-0"] > circle');
    // If chip somehow still there, pick another numbered empty on bottom after we check
    if (vacated?.getAttribute('fill') === '#e8e8e8') {
      expect(vacated?.getAttribute('stroke')).toBe('#999');
      expect(vacated?.getAttribute('stroke-width')).toBe('2');
    } else {
      // Red still occupies bottom; force empty numbered by clearing via state clone
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
    }
  });
});
