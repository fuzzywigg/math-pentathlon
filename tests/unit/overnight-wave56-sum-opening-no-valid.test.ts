/**
 * Wave 56 leftover after #243 — Sum Dominoes opening no-valid residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — opening no valid', () => {
  it('has zero .sd-cell-valid before selection', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.sd-cell-valid').length).toBe(0);
    expect(el.querySelector('.sd-domino')).toBeTruthy();
  });
});
