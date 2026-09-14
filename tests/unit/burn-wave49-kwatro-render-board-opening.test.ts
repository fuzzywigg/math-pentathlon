/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro renderBoard opening nodes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — renderBoard opening', () => {
  it('renders kwa-board with svg nodes matching state', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined, () => undefined);
    expect(el.classList.contains('kwa-board')).toBe(true);
    expect(el.querySelectorAll('.kwa-svg [data-node-id]').length).toBe(state.nodes.size);
  });
});
