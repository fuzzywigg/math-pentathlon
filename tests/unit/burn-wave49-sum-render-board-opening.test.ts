/**
 * Wave 49 leftover after #221/#226/#227 — Sum Dominoes renderBoard opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — renderBoard', () => {
  it('renders sd-board with empty cells at opening', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.classList.contains('sd-board')).toBe(true);
    expect(el.querySelectorAll('.sd-cell').length).toBeGreaterThan(0);
  });
});
