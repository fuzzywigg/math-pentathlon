/**
 * Wave 58 leftover after #267 — Queens board bg fill + container CSS.
 * Distinct from drop-shadow leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { injectQGStyles, renderBoard } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.getElementById('qg-styles')?.remove();
});

describe('Wave 58 queens — board bg + container', () => {
  it('SVG background uses #f8f4e8; inject embeds .qg-board-container', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('fill')).toBe('#f8f4e8');
    injectQGStyles();
    expect(document.getElementById('qg-styles')?.textContent ?? '').toMatch(
      /\.qg-board-container/
    );
  });
});
