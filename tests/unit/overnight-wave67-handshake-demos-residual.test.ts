/**
 * Wave 67 leftover after tip/#324 (unit-only) — Handshake demos residual chrome.
 * Distinct from wave64 residual handshake (#311). Tests-only.
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

describe('Wave 67 handshake — demos residual chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts leftover exact chrome across residual demos', () => {
    const expr = document.createElement('div');
    document.body.appendChild(expr);
    renderExpressionDemo(expr);
    const eCss = expr.querySelector('style')?.textContent ?? '';
    expect(eCss).toContain('border-bottom: 1px solid #eee');
    expect(eCss).toContain('.solution-item.exact');

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect((frac.querySelector('#fraction-a') as HTMLInputElement).value).toBe('3/4');
    expect((frac.querySelector('#compare-a') as HTMLInputElement).value).toBe('2/3');

    document.body.innerHTML = '';
    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    const aCss = attr.querySelector('style')?.textContent ?? '';
    expect(aCss).toContain('border: 2px dashed #ccc');
    expect(aCss).toContain('color: #ef6c00');

    document.body.innerHTML = '';
    const graph = document.createElement('div');
    document.body.appendChild(graph);
    renderGraphDemo(graph);
    const gCss = graph.querySelector('style')?.textContent ?? '';
    expect(gCss).toContain('min-height: 200px');
    expect(gCss).toContain('.player-btn[data-player="1"].selected');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    const pCss = poly.querySelector('style')?.textContent ?? '';
    expect(pCss).toContain('min-width: 150px');
    expect(pCss).toContain('grid-template-columns: auto 1fr');

    document.body.innerHTML = '';
    const align = document.createElement('div');
    document.body.appendChild(align);
    renderAlignmentDemo(align);
    const alCss = align.querySelector('style')?.textContent ?? '';
    expect(alCss).toContain('transform: scale(1.05)');
    expect(alCss).toContain('.cell-x { background: #bbdefb; color: #1565c0; }');

    document.body.innerHTML = '';
    const dice = document.createElement('div');
    document.body.appendChild(dice);
    renderDiceDemo(dice);
    const dCss = dice.querySelector('style')?.textContent ?? '';
    expect(dCss).toContain('min-height: 80px');
    expect(dCss).toContain('border-bottom: 2px solid #ddd');
  });
});
