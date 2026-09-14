/**
 * Wave 48 — Remainder renderBoard SVG islands. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — svg board', () => {
  it('renders island groups with values', () => {
    const s = createInitialState();
    const svg = renderBoard(s, () => undefined, () => undefined);
    expect(svg.classList.contains('remainder-board')).toBe(true);
    expect(svg.querySelectorAll('.island').length).toBe(s.islands.length);
    expect(svg.querySelector('[data-island-id]')?.getAttribute('data-island-id')).toBeTruthy();
  });
});
