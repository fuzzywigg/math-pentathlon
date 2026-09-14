/**
 * Wave 54 leftover after #237 — FIAR svg 100% size leftover (wave52 viewBox). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — svg size', () => {
  it('sets width/height 100% and maxWidth from padded bounds', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.getAttribute('width')).toBe('100%');
    expect(svg.getAttribute('height')).toBe('100%');
    expect(svg.style.maxWidth).toMatch(/px$/);
    expect(svg.style.maxHeight).toMatch(/px$/);
  });
});
