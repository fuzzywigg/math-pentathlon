/**
 * Wave 61 leftover after #301 (unit-only) — Handshake demos residual chrome mount.
 * Distinct from wave60 residual section paras / Possible Sums handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderDiceDemo } from '../../src/demos/dice-demo';

describe('Wave 61 handshake — demos residual chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts leftover exact chrome across residual demos', () => {
    const expr = document.createElement('div');
    document.body.appendChild(expr);
    renderExpressionDemo(expr);
    expect(
      expr.querySelector('.example-expressions > span')?.textContent
    ).toBe('Try:');
    expect(expr.querySelector('#back-btn')?.textContent).toBe('← Back');

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect(
      frac.querySelector('.comparison-inputs > span')?.textContent
    ).toBe('vs');
    expect(frac.querySelector('#interactive-value')?.textContent).toBe('1/4');

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    expect(attr.querySelector('#back-btn')?.textContent).toBe('← Back');
    expect(
      [...attr.querySelectorAll('#filter-controls .filter-group label')].map(
        (el) => el.textContent ?? ''
      )
    ).toEqual(['Shape', 'Color', 'Size']);

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    expect(graph.querySelector('#clear-path-btn')?.textContent).toBe('Clear');
    expect(
      graph
        .querySelector('.player-btn[data-player="1"]')
        ?.classList.contains('selected')
    ).toBe(true);

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    expect(poly.querySelector('#back-btn')?.textContent).toBe('← Back');

    document.body.innerHTML = '';
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    const css = align.querySelector('style')?.textContent ?? '';
    expect(css).toContain('max-width: 900px');

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    expect(dice.querySelector('h1')?.textContent).toBe('🎲 Dice System Demo');
    const diceCss = dice.querySelector('style')?.textContent ?? '';
    expect(diceCss).toContain('max-height: 200px');
  });
});
