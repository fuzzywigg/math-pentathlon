/**
 * Wave 49 — Queens captured piece red stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — captured stroke', () => {
  it('strokes captured coord red', () => {
    const s = {
      ...createInitialState(),
      capturedPieces: [{ ring: 0, position: 0 }],
    };
    const svg = renderBoard(s, () => undefined);
    const hex = svg.querySelector('[data-cell-key="0-0"] path')!;
    expect(hex.getAttribute('stroke')).toBe('#f44336');
    expect(hex.getAttribute('stroke-width')).toBe('3');
  });
});
