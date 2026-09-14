/**
 * Wave 49 — Queens throne data-cell-key leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — throne cell-key', () => {
  it('mounts throne as data-cell-key=0-0', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="0-0"]')).toBeTruthy();
  });
});
