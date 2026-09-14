/**
 * Wave 35 — expression-ui × evaluator handshake montage.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  injectExpressionStyles,
  renderExpressionBuilder,
  renderCardTray,
  createInteractiveBuilder,
  renderTargetDisplay,
  renderChallengeCard,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  createExpressionDeck,
  MAKE_TEN_CHALLENGES,
} from '../../src/core/expressions/types';
import { evaluate, validateSlots } from '../../src/core/expressions/evaluator';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — handshake montage', () => {
  it('styles + tray + builder agree with validateSlots/evaluate', () => {
    injectExpressionStyles();
    const challenge = MAKE_TEN_CHALLENGES[0]!;
    document.body.appendChild(renderTargetDisplay(challenge));
    document.body.appendChild(renderChallengeCard(challenge));

    const a = challenge.numbers[0]!;
    const b = challenge.numbers[1]!;
    const slots = [
      createSlot(0, createNumberCard(a, 'n0')),
      createSlot(1, createOperatorCard('+', 'op')),
      createSlot(2, createNumberCard(b, 'n1')),
    ];
    const builderEl = renderExpressionBuilder(
      { slots, targetValue: a + b },
      { showResult: true }
    );
    document.body.appendChild(builderEl);
    const validation = validateSlots(slots);
    expect(validation.canEvaluate).toBe(true);
    expect(validation.result).toBe(a + b);
    expect(builderEl.querySelector('.expression-result.valid')).toBeTruthy();

    const deck = createExpressionDeck({
      numbers: challenge.numbers,
      operators: ['+'],
      includeParens: false,
    });
    const tray = renderCardTray(deck);
    expect(tray.querySelectorAll('.expression-card.number')).toHaveLength(
      challenge.numbers.length
    );
    const sum = challenge.numbers.reduce((x, y) => x + y, 0);
    const ev = evaluate(challenge.numbers.join(' + '));
    expect(ev.success).toBe(true);
    expect(ev.value).toBe(sum);
  });

  it('interactive builder result matches evaluate(getExpression())', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(8, 'a'),
        createOperatorCard('*', 'm'),
        createNumberCard(3, 'b'),
      ],
    });
    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];
    tray()
      .find((e) => e.textContent === '8')!
      .click();
    slots()[0]!.click();
    tray()
      .find((e) => e.textContent === '*')!
      .click();
    slots()[1]!.click();
    tray()
      .find((e) => e.textContent === '3')!
      .click();
    slots()[2]!.click();
    const expr = api.getExpression();
    expect(expr).toBe('8 * 3');
    const ev = evaluate(expr);
    expect(ev.success).toBe(true);
    expect(api.getResult()).toBe(ev.value);
  });
});
