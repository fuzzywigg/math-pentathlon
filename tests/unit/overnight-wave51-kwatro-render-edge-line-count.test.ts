/**
 * Wave 51 leftover after #233 — Kwatro opening edge line count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — edge lines', () => {
  it('draws one line per undirected connection', () => {
    const state = createInitialState();
    let expected = 0;
    for (const node of state.nodes.values()) {
      for (const connId of node.connections) {
        if (connId > node.id) expected += 1;
      }
    }
    const el = renderBoard(state, () => undefined, () => undefined);
    expect(el.querySelectorAll('line').length).toBe(expected);
  });
});
