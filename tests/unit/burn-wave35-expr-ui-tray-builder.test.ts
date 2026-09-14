/**
 * Wave 35 — renderCardTray / renderExpressionBuilder leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderCardTray,
  renderExpressionBuilder,
  createExpressionDeck,
  createSlot,
  createNumberCard,
  createOperatorCard,
  injectExpressionStyles,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#expression-styles')
    .forEach((el) => el.remove());
});

describe('Wave 35 expr-ui-tray — deck render', () => {
  it('renders a card per deck entry', () => {
    injectExpressionStyles();
    const deck = createExpressionDeck({
      numbers: [1, 2, 3],
      operators: ['+'],
      includeParens: false,
    });
    const tray = renderCardTray(deck);
    expect(tray.className).toBe('card-tray');
    expect(tray.querySelectorAll('.expression-card').length).toBe(deck.length);
  });
});

describe('Wave 35 expr-ui-builder — slot chrome', () => {
  it('renders slots with placed cards', () => {
    injectExpressionStyles();
    const builder = {
      slots: [
        createSlot(0, createNumberCard(2)),
        createSlot(1, createOperatorCard('+')),
        createSlot(2, createNumberCard(5)),
      ],
      targetValue: 7,
    };
    const el = renderExpressionBuilder(builder, { showResult: true });
    expect(el.querySelectorAll('.expression-slot').length).toBe(3);
    expect(el.textContent).toMatch(/2/);
    expect(el.textContent).toMatch(/5/);
    expect(el.querySelector('.expression-result')?.textContent).toMatch(/7/);
  });
});
