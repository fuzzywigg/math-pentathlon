/**
 * Wave 52 — Queens center gold fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — center gold', () => {
  it('fills throne 0-0 with #ffd700', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const hex = svg.querySelector('[data-cell-key="0-0"] path')!;
    expect(hex.getAttribute('fill')).toBe('#ffd700');
  });
});
