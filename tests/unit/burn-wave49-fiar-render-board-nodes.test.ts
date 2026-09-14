/**
 * Wave 49 leftover after #221/#226/#227 — FIAR renderBoard nodes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — renderBoard', () => {
  it('renders board container with node groups', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined);
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.querySelectorAll('[data-node-id]').length).toBe(state.board.nodes.size);
  });
});
