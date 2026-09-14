/**
 * Wave 49 — FIAR selected node orange stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, selectChip, getSelectableNodes } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

const SPREAD = ['0-0', '0-4', '4-0', '4-4', '0-2', '4-2', '2-0', '2-4'];

describe('Wave 49 fiar — selected stroke', () => {
  it('strokes selected chip node orange width 4 in movement', () => {
    let s = createInitialState();
    for (const id of SPREAD) s = placeChip(s, id);
    expect(s.phase).toBe('movement');
    const own = getSelectableNodes(s)[0]!;
    s = selectChip(s, own);
    expect(s.selectedNode).toBe(own);
    const svg = renderBoard(s, () => undefined);
    // Node bg circle is the one without pulse-highlight (dash ring may be firstChild).
    const circle = svg.querySelector(
      `[data-node-id="${own}"] > circle:not(.pulse-highlight)`
    )!;
    expect(circle.getAttribute('stroke')).toBe('#ff9800');
    expect(circle.getAttribute('stroke-width')).toBe('4');
  });
});
