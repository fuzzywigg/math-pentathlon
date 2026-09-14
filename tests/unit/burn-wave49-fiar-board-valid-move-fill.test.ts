/**
 * Wave 49 — FIAR valid-move green fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import {
  placeChip,
  selectChip,
  getValidMoves,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

const SPREAD = ['0-0', '0-4', '4-0', '4-4', '0-2', '4-2', '2-0', '2-4'];

describe('Wave 49 fiar — valid move fill', () => {
  it('paints valid destinations green when chip selected', () => {
    let s = createInitialState();
    for (const id of SPREAD) s = placeChip(s, id);
    const own = getSelectableNodes(s)[0]!;
    s = selectChip(s, own);
    const moves = getValidMoves(s, own);
    expect(moves.length).toBeGreaterThan(0);
    const svg = renderBoard(s, () => undefined);
    const dest = moves[0]!;
    const circle = svg.querySelector(`[data-node-id="${dest}"] > circle`)!;
    expect(circle.getAttribute('fill')).toBe('#4caf50');
    expect(circle.getAttribute('stroke-width')).toBe('3');
  });
});
