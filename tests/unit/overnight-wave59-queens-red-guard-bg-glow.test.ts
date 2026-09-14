/**
 * Wave 59 leftover after #281 — Queens Red Guard aria + bg fill + drop-shadow/qg-glow.
 * Distinct from wave58 empty/Blue Guard/Red Queen/selected/valid-move/Space/hover/status. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { injectQGStyles, renderBoard } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.getElementById('qg-styles')?.remove();
});

describe('Wave 59 queens — Red Guard + bg + glow', () => {
  it('announces Red Guard; board bg #f8f4e8; inject drop-shadow + qg-glow', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="5-16"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 16, Red Guard'
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#f8f4e8');
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/drop-shadow/);
    expect(css).toMatch(/@keyframes qg-glow/);
  });
});
