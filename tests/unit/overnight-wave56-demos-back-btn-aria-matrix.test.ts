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
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 demos — back-btn aria matrix', () => {
  it('graph/attr/expr use Back to home; frac/poly use Back to game list', () => {
    const home = mountRoot();
    renderGraphDemo(home);
    expect(home.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const attr = mountRoot();
    renderAttributeDemo(attr);
    expect(attr.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const expr = mountRoot();
    renderExpressionDemo(expr);
    expect(expr.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to home'
    );

    document.body.innerHTML = '';
    const frac = mountRoot();
    renderFractionDemo(frac);
    expect(frac.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to game list'
    );

    document.body.innerHTML = '';
    const poly = mountRoot();
    renderPolyominoDemo(poly);
    expect(poly.querySelector('#back-btn')?.getAttribute('aria-label')).toBe(
      'Back to game list'
    );
  });
});
