/**
 * Wave 35 — renderCard / renderCardSVG type × option matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderCard,
  renderCardSVG,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — renderCard matrix', () => {
  it.each([
    ['number', () => createNumberCard(9, 'n9'), '9'],
    ['operator', () => createOperatorCard('*', 'mul'), '*'],
    ['lparen', () => createParenCard(true, 'lp'), '('],
    ['rparen', () => createParenCard(false, 'rp'), ')'],
  ] as const)('%s card mounts class + content', (token, factory, text) => {
    const card = factory();
    const el = renderCard(card);
    expect(el.classList.contains('expression-card')).toBe(true);
    expect(el.classList.contains(token)).toBe(true);
    expect(el.textContent).toBe(text);
    expect(el.dataset.cardId).toBe(card.id);
  });

  it('selected + onClick + drag lifecycle', () => {
    const clicks: string[] = [];
    const el = renderCard(createNumberCard(2, 'n2'), {
      selected: true,
      draggable: true,
      onClick: (c) => clicks.push(c.id),
    });
    expect(el.classList.contains('selected')).toBe(true);
    expect(el.draggable).toBe(true);
    el.click();
    expect(clicks).toEqual(['n2']);

    const dt = { setData: vi.fn() };
    const start = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(start, 'dataTransfer', { value: dt });
    el.dispatchEvent(start);
    expect(el.classList.contains('dragging')).toBe(true);
    expect(dt.setData).toHaveBeenCalledWith('text/plain', 'n2');
    el.dispatchEvent(new Event('dragend'));
    expect(el.classList.contains('dragging')).toBe(false);
  });
});

describe('Wave 35 expr-ui — renderCardSVG matrix', () => {
  it.each(['+', '-', '*', '/'] as const)('operator SVG %s', (op) => {
    const g = renderCardSVG(createOperatorCard(op, `op-${op}`), 5, 15);
    expect(g.getAttribute('transform')).toBe('translate(5, 15)');
    expect(g.dataset.cardId).toBe(`op-${op}`);
    expect(g.querySelector('text')?.textContent).toBe(op);
    expect(g.querySelector('rect')).toBeTruthy();
  });

  it('custom width/height applied to rect', () => {
    const g = renderCardSVG(createNumberCard(1, 'w'), 0, 0, {
      width: 80,
      height: 100,
    });
    const rect = g.querySelector('rect')!;
    expect(rect.getAttribute('width')).toBe('80');
    expect(rect.getAttribute('height')).toBe('100');
  });

  it('paren SVGs render left and right glyphs', () => {
    expect(
      renderCardSVG(createParenCard(true, 'L'), 0, 0).querySelector('text')
        ?.textContent
    ).toBe('(');
    expect(
      renderCardSVG(createParenCard(false, 'R'), 0, 0).querySelector('text')
        ?.textContent
    ).toBe(')');
  });
});
