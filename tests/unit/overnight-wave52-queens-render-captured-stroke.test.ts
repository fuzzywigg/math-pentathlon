/**
 * Wave 52 — Queens captured stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — captured stroke', () => {
  it('uses #f44336 stroke width 3 on captured coords', () => {
    const state = {
      ...createInitialState(),
      capturedPieces: [{ ring: 5, position: 7 }],
    };
    const svg = renderBoard(state, () => undefined);
    const hex = svg.querySelector('[data-cell-key="5-7"] path')!;
    expect(hex.getAttribute('stroke')).toBe('#f44336');
    expect(hex.getAttribute('stroke-width')).toBe('3');
  });
});
