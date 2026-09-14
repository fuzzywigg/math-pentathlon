/**
 * Wave 55 leftover after #250 — Hex SVG width/height 100% and role=grid. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — svg attrs', () => {
  it('hex-board is 100% sized ARIA grid', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el, () => undefined);
    const svg = el.querySelector('.hex-board');
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('height')).toBe('100%');
    expect(svg?.getAttribute('role')).toBe('grid');
  });
});
