/**
 * Wave 61 leftover after #301 (unit-only) — Handshake demos residual chrome mount.
 * Distinct from wave60 residual section-paras / tip / log-area handshake. Tests-only.
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

describe('Wave 61 handshake — demos residual chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts leftover inject CSS + exact chrome across residual demos', () => {
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    const alignCss = align.querySelector('style')?.textContent ?? '';
    expect(alignCss).toContain(
      '.cell-x { background: #bbdefb; color: #1565c0; }'
    );
    expect(align.querySelector('#four-board')?.className).toBe(
      'demo-board four-board'
    );

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    const attrCss = attr.querySelector('style')?.textContent ?? '';
    expect(attrCss).toContain('border: 2px dashed #ccc');
    expect(attrCss).toContain('color: #ef6c00');

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    expect(
      (dice.querySelector('#quick-roll-result span') as HTMLElement)?.getAttribute(
        'style'
      )
    ).toBe('color: #999; font-style: italic;');
    const diceCss = dice.querySelector('style')?.textContent ?? '';
    expect(diceCss).toContain('background: #1565c0');

    document.body.innerHTML = '';
    const expr = document.createElement('div');
    document.body.appendChild(expr);
    renderExpressionDemo(expr);
    const exprCss = expr.querySelector('style')?.textContent ?? '';
    expect(exprCss).toContain('#equation-result.true {');
    expect(exprCss).toContain(
      'grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))'
    );

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    const fracCss = frac.querySelector('style')?.textContent ?? '';
    expect(fracCss).toContain('background: #45a049');
    expect(fracCss).toContain(
      'grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))'
    );

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    const graphCss = graph.querySelector('style')?.textContent ?? '';
    expect(graphCss).toContain(
      '.player-btn[data-player="2"].selected {'
    );
    expect(graphCss).toContain('background: #ffebee');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    const polyCss = poly.querySelector('style')?.textContent ?? '';
    expect(polyCss).toContain('min-height: 150px');
    expect(polyCss).toContain('grid-template-columns: auto 1fr');
  });
});
