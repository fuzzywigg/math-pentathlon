/**
 * Wave 56 leftover after #256 — Calla SVG width/height 100%.
 * Complements wave52 viewBox leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — svg width height 100', () => {
  it('sets calla-board svg width and height to 100%', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const svg = el.querySelector('svg.calla-board');
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('height')).toBe('100%');
  });
});
