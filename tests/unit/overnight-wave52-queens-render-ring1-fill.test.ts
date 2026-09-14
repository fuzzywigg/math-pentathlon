/**
 * Wave 52 — Queens ring-1 fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — ring1 fill', () => {
  it('fills ring-1 cell with #ffeb99', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const hex = svg.querySelector('[data-cell-key="1-0"] path')!;
    expect(hex.getAttribute('fill')).toBe('#ffeb99');
  });
});
