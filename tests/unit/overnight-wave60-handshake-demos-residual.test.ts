/**
 * Wave 60 leftover after #290 (unit-only) — Handshake demos residual chrome mount.
 * Distinct from wave59 residual Find Solutions / Horizontal Bars handshake. Tests-only.
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

describe('Wave 60 handshake — demos residual chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts leftover exact chrome across residual demos', () => {
    const expr = document.createElement('div');
    document.body.appendChild(expr);
    renderExpressionDemo(expr);
    expect(
      [...expr.querySelectorAll('.demo-section > p')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('Drag cards to build expressions');
    expect(
      (expr.querySelector('#calc-input') as HTMLInputElement).placeholder
    ).toBe('e.g., 2 + 3 * 4');

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect(
      [...frac.querySelectorAll('.demo-section > p')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('Different styles of fraction visualization');

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    expect(attr.querySelector('#valid-sets-info')?.textContent).toContain(
      'A valid SET requires each attribute'
    );

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    expect(
      [...graph.querySelectorAll('.demo-section > p')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('Pre-built graph structures for different game types');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    expect(
      [...poly.querySelectorAll('.demo-section > p')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('Select a polyomino set to explore');

    document.body.innerHTML = '';
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    expect(
      [...align.querySelectorAll('.demo-instructions')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain(
      'Click cells to place X. See alignment potential for each direction.'
    );

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    const css = dice.querySelector('style')?.textContent ?? '';
    expect(css).toContain('background: #263238');
    expect(
      [...dice.querySelectorAll('h2')].map((el) => el.textContent ?? '')
    ).toContain('Possible Sums Display');
  });
});
