/**
 * Wave 49 leftover after #221/#226/#227 — Par55 renderBoard bases. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — renderBoard bases', () => {
  it('renders par55-board with base nodes matching state', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined);
    expect(el.classList.contains('par55-board')).toBe(true);
    expect(el.querySelectorAll('[data-base-id]').length).toBe(state.bases.size);
  });
});
