/**
 * Wave 56 leftover after #256 — Demo #back-btn aria-label home vs game-list matrix.
 * Distinct from navigate('/') click leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 demos — back-btn aria matrix', () => {
  it('graph/attr/expr use Back to home; frac/poly use Back to game list', () => {
    const home = mount();
    renderGraphDemo(home);
    expect(home.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const attr = mount();
    renderAttributeDemo(attr);
    expect(attr.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const expr = mount();
    renderExpressionDemo(expr);
    expect(expr.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const frac = mount();
    renderFractionDemo(frac);
    expect(frac.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to game list'
    );

    document.body.innerHTML = '';
    const poly = mount();
    renderPolyominoDemo(poly);
    expect(poly.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to game list'
    );
  });
});
