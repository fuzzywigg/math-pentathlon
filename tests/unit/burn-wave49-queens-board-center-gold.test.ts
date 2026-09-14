/**
 * Wave 49 — Queens center ring gold fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — center gold', () => {
  it('fills ring-0 center cell gold', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const hex = svg.querySelector('[data-cell-key="0-0"] path')!;
    expect(hex.getAttribute('fill')).toBe('#ffd700');
  });
});
