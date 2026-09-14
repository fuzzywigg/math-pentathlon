/**
 * Wave 51 leftover after #233 — Kwatro winning gold stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — winning gold', () => {
  it('paints #ffd700 / #ff9800 on winningAlignment nodes', () => {
    const base = createInitialState();
    const nodeId = [...base.nodes.keys()][0];
    const state = {
      ...base,
      winningAlignment: {
        nodes: [nodeId],
        chips: [],
        expression: '4 + 0 = 4',
        result: 4,
      },
    };
    const el = renderBoard(state, () => undefined, () => undefined);
    const circle = el.querySelector(`[data-node-id="${nodeId}"] > circle`);
    expect(circle?.getAttribute('fill')).toBe('#ffd700');
    expect(circle?.getAttribute('stroke')).toBe('#ff9800');
    expect(circle?.getAttribute('stroke-width')).toBe('3');
  });
});
