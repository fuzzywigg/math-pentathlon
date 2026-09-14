/**
 * Wave 49 — Queens data-cell-key for p1 queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — cell-key queen', () => {
  it('mounts data-cell-key=5-7 for player1 queen', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="5-7"]')).toBeTruthy();
  });
});
