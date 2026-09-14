/**
 * Wave 35 — renderCardTray selection / usedIds / click matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { renderCardTray } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createExpressionDeck,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — card tray', () => {
  it('skips usedIds and marks selectedId', () => {
    const cards = [
      createNumberCard(1, 'a'),
      createNumberCard(2, 'b'),
      createOperatorCard('+', 'p'),
    ];
    const clicked: string[] = [];
    const tray = renderCardTray(cards, {
      selectedId: 'a',
      usedIds: new Set(['b']),
      onClick: (c) => clicked.push(c.id),
    });
    expect(tray.className).toBe('card-tray');
    const els = [...tray.querySelectorAll('.expression-card')];
    expect(els).toHaveLength(2);
    expect(els.map((e) => (e as HTMLElement).dataset.cardId).sort()).toEqual([
      'a',
      'p',
    ]);
    expect(tray.querySelector('.selected')?.getAttribute('data-card-id')).toBe(
      'a'
    );
    (
      els.find((e) => (e as HTMLElement).dataset.cardId === 'p') as HTMLElement
    ).click();
    expect(clicked).toEqual(['p']);
  });

  it('deck factory fills tray with numbers ops parens', () => {
    const deck = createExpressionDeck({
      numbers: [1, 2, 3],
      operators: ['+', '-'],
      includeParens: true,
    });
    const tray = renderCardTray(deck, { draggable: true });
    expect(tray.querySelectorAll('.expression-card')).toHaveLength(deck.length);
    expect(tray.querySelectorAll('.expression-card.number')).toHaveLength(3);
    expect(tray.querySelectorAll('.expression-card.operator')).toHaveLength(2);
    expect(tray.querySelectorAll('.expression-card.lparen')).toHaveLength(1);
    expect(tray.querySelectorAll('.expression-card.rparen')).toHaveLength(1);
    expect(
      [...tray.querySelectorAll('.expression-card')].every(
        (el) => (el as HTMLElement).draggable
      )
    ).toBe(true);
  });

  it('empty used set renders all; full used set renders none', () => {
    const cards = [createParenCard(true, 'lp'), createParenCard(false, 'rp')];
    expect(
      renderCardTray(cards, { usedIds: new Set() }).querySelectorAll(
        '.expression-card'
      )
    ).toHaveLength(2);
    expect(
      renderCardTray(cards, {
        usedIds: new Set(['lp', 'rp']),
      }).querySelectorAll('.expression-card')
    ).toHaveLength(0);
  });
});
