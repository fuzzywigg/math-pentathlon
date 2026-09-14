/**
 * Wave 64 leftover after tip/#303 (unit-only) — Handshake demos residual chrome.
 * Distinct from wave60 residual section-paras/handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderDiceDemo } from '../../src/demos/dice-demo';

describe('Wave 64 handshake — demos residual chrome', () => {
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
    expect(
      (expr.querySelector('#num1') as HTMLInputElement).value
    ).toBe('1');

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect(
      (frac.querySelector('#denominator-select') as HTMLSelectElement).value
    ).toBe('4');
    expect(frac.querySelector('#interactive-value')?.textContent).toBe('1/4');

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    expect(
      attr
        .querySelector('.attribute-set-selector .set-btn[data-set="math"]')
        ?.textContent
    ).toBe('Math Properties');

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    expect(graph.querySelector('#clear-path-btn')?.textContent).toBe('Clear');
    expect(
      [...graph.querySelectorAll('#game-analysis h4')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('Board Status');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    expect(
      poly
        .querySelector('.shape-set-selector .set-btn[data-set="pattern"]')
        ?.textContent
    ).toBe('Pattern Blocks');

    document.body.innerHTML = '';
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    const aCss = align.querySelector('style')?.textContent ?? '';
    expect(aCss).toContain('@keyframes pulse-winner');
    expect(aCss).toContain('grid-template-columns: repeat(7, 50px)');

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    const dCss = dice.querySelector('style')?.textContent ?? '';
    expect(dCss).toContain('color: #1a237e');
    expect(
      dice
        .querySelector('.quick-roll-btn[data-dice="d20"]')
        ?.getAttribute('data-count')
    ).toBe('1');
  });
});
