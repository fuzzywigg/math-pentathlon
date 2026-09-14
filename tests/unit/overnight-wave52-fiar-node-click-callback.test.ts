/**
 * Wave 52 — FIAR node click callback leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — node click', () => {
  it('invokes onNodeClick with data-node-id', () => {
    let clicked: string | null = null;
    const state = createInitialState();
    const id = [...state.board.nodes.keys()][0]!;
    const svg = renderBoard(state, (nodeId) => {
      clicked = nodeId;
    });
    const g = svg.querySelector(`[data-node-id="${id}"]`)!;
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicked).toBe(id);
  });
});
