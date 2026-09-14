/**
 * Wave 59 leftover after #281 (unit-only) — Handshake demos residual chrome mount.
 * Distinct from wave58 Path found / True! / board-ui aria handshake. Tests-only.
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

describe('Wave 59 handshake — demos residual chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts leftover exact chrome across residual demos', () => {
    const expr = document.createElement('div');
    document.body.appendChild(expr);
    renderExpressionDemo(expr);
    expect(expr.querySelector('h1')?.textContent).toBe('Expression Builder Demo');
    expect(expr.querySelector('#solve-btn')?.textContent).toBe('Find Solutions');

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect(
      [...frac.querySelectorAll('h3')].map((el) => el.textContent ?? '')
    ).toContain('Horizontal Bars');
    expect(frac.querySelector('.comparison-text')?.textContent).toBe(
      '2/3 is less than 3/4'
    );

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    expect(
      [...attr.querySelectorAll('h2')].map((el) => el.textContent ?? '')
    ).toContain('SET Game Cards');

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    expect(
      [...graph.querySelectorAll('.template-btn')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('4x4 Grid');
    expect(
      [...graph.querySelectorAll('h2')].map((el) => el.textContent ?? '')
    ).toContain('Connectivity Analysis');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    expect(poly.querySelector('h1')?.textContent).toBe('Polyomino System Demo');
    expect(poly.querySelector('#empty-count')?.textContent).toBe('Empty: 100');

    document.body.innerHTML = '';
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    expect(align.querySelector('h1')?.textContent).toBe(
      '🔗 Alignment Detection Demo'
    );
    expect(align.querySelector('#four-reset')?.textContent).toBe('Reset Game');

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    expect(
      [...dice.querySelectorAll('h2')].map((el) => el.textContent ?? '')
    ).toContain('Interactive Selector (3 Polyhedral - Prime Gold Style)');
  });
});
