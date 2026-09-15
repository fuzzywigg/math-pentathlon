/**
 * Wave 65 leftover after tip/#315 — Kwatro winning node gold stroke chrome.
 * Aria winning covered; deepen fill/stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render winning node gold stroke', () => {
  it('winningAlignment nodes fill #ffd700 stroke #ff9800 width 3', () => {
    const state = createInitialState();
    const chip = state.chips.get('p1-0')!;
    state.winningAlignment = {
      nodes: ['n0-0'],
      chips: [chip],
      expression: '0 + 2 - 4 = -2',
      result: 4,
    };
    const el = renderBoard(state, () => undefined, () => undefined);
    const circle = el.querySelector('[data-node-id="n0-0"] > circle');
    expect(circle?.getAttribute('fill')).toBe('#ffd700');
    expect(circle?.getAttribute('stroke')).toBe('#ff9800');
    expect(circle?.getAttribute('stroke-width')).toBe('3');
  });
});
