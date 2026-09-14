/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab fraction bar SVG dims.
 * Soft fill/class coverage exists; deepen width 100 + below-label height leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 63 fab — render bar svg dims', () => {
  it('fraction bars render 100-wide SVG with below-label height 55', () => {
    const el = renderFractionBarPool(createInitialState(), () => {});
    document.body.appendChild(el);
    const svg = el.querySelector('.fab-bar-wrapper svg');
    // bar height 30 + below-label pad 25
    expect(svg?.getAttribute('width')).toBe('100');
    expect(svg?.getAttribute('height')).toBe('55');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 100 55');
  });
});
