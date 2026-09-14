/**
 * Wave 34 — expression renderCardSVG size/type matrix leftovers.
 * Deepens wave 22 SVG smoke into measurable geometry × token types.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  renderCardSVG,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 34 expr-ui-card-svg — type × size matrix', () => {
  it.each([
    ['number', () => createNumberCard(12, 'n12')],
    ['operator', () => createOperatorCard('/', 'div')],
    ['lparen', () => createParenCard(true, 'lp')],
    ['rparen', () => createParenCard(false, 'rp')],
  ] as const)('%s card SVG uses custom width/height and text', (kind, factory) => {
    const card = factory();
    const g = renderCardSVG(card, 10, 20, { width: 55, height: 70 });
    expect(g.getAttribute('transform')).toBe('translate(10, 20)');
    expect(g.dataset.cardId).toBe(card.id);
    const rect = g.querySelector('rect');
    expect(rect?.getAttribute('width')).toBe('55');
    expect(rect?.getAttribute('height')).toBe('70');
    expect(g.querySelector('text')?.textContent).toBe(card.content);
    expect(kind).toBeTruthy();
  });

  it('default size is 40×56 when options omitted', () => {
    const g = renderCardSVG(createNumberCard(1, 'one'), 0, 0);
    expect(g.querySelector('rect')?.getAttribute('width')).toBe('40');
    expect(g.querySelector('rect')?.getAttribute('height')).toBe('56');
  });
});
