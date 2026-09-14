/**
 * Wave 49 — FIAR selectable chip dashed pulse leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, getSelectableNodes } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — selectable dash', () => {
  it('adds dashed pulse highlight around selectable chips', () => {
    let s = createInitialState();
    const nodes = [...s.board.nodes.keys()];
    for (let i = 0; i < 8; i++) {
      s = placeChip(s, nodes[i]!);
    }
    const selectable = getSelectableNodes(s);
    expect(selectable.length).toBeGreaterThan(0);
    const svg = renderBoard(s, () => undefined);
    const g = svg.querySelector(`[data-node-id="${selectable[0]}"]`)!;
    const dash = g.querySelector('circle.pulse-highlight')!;
    expect(dash.getAttribute('stroke-dasharray')).toBe('4 2');
    expect(dash.getAttribute('stroke')).toBe('#ff9800');
  });
});
