/**
 * Wave 62 leftover after #293 — Calla board-bg width/height SVG attrs.
 * Distinct from wave52 viewBox and wave58 rx. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 62 calla — board-bg size', () => {
  it('renders .calla-board-bg with width=500 height=200', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const bg = el.querySelector('.calla-board-bg');
    expect(bg?.getAttribute('width')).toBe('500');
    expect(bg?.getAttribute('height')).toBe('200');
  });
});
