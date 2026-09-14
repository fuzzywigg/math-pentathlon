/**
 * Wave 49 — FIAR movement skips placement empty fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — movement empty fill', () => {
  it('uses default node fill on empty nodes in movement', () => {
    let s = createInitialState();
    const nodes = [...s.board.nodes.keys()];
    for (let i = 0; i < 8; i++) {
      s = placeChip(s, nodes[i]!);
    }
    expect(s.phase).toBe('movement');
    const empty = nodes.find((id) => s.board.nodes.get(id)?.chip === null)!;
    const svg = renderBoard(s, () => undefined);
    const circle = svg.querySelector(`[data-node-id="${empty}"] > circle`)!;
    expect(circle.getAttribute('fill')).toBe('#dcd0c0');
  });
});
