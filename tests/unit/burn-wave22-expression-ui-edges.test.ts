/**
 * Wave 22 — expression-ui remount + interactive builder + challenge display.
 * Distinct from expressions.test.ts evaluator smoke (no prior UI burn coverage).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  injectExpressionStyles,
  renderCard,
  renderCardSVG,
  renderSlot,
  renderExpressionBuilder,
  renderCardTray,
  renderTargetDisplay,
  renderChallengeCard,
  createInteractiveBuilder,
  renderCalculatorDisplay,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  createBasicNumberCards,
  createBasicOperatorCards,
  createTargetChallenge,
  createExpressionDeck,
  validateSlots,
  slotsToExpression,
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 22 expression-ui — cards / slots / tray remount', () => {
  it('renderCard / SVG / slot / tray mount without throw', () => {
    injectExpressionStyles();
    expect(document.querySelector('style')).toBeTruthy();

    const num = createNumberCard(7, 'n7');
    const op = createOperatorCard('+', 'op-plus');
    const paren = createParenCard(true, 'lp');

    const cardEl = renderCard(num);
    expect(cardEl.classList.contains('expression-card')).toBe(true);
    expect(cardEl.textContent).toContain('7');

    const svg = renderCardSVG(op);
    expect(['svg', 'g']).toContain(svg.tagName.toLowerCase());

    const slot = createSlot(0, paren);
    const slotEl = renderSlot(slot);
    expect(slotEl.classList.contains('expression-slot')).toBe(true);

    const tray = renderCardTray([num, op, paren]);
    expect(tray.querySelectorAll('.expression-card').length).toBe(3);

    // Remount same tray host
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.appendChild(tray);
    host.appendChild(renderCard(op));
    expect(
      host.querySelectorAll('.expression-card').length
    ).toBeGreaterThanOrEqual(2);
  });
});

describe('Wave 22 expression-ui — builder + target challenge chrome', () => {
  it('renderExpressionBuilder shows slots and optional result', () => {
    const slots = [
      createSlot(0, createNumberCard(2)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(3)),
    ];
    const el = renderExpressionBuilder(
      { slots, targetValue: 5 },
      { showResult: true }
    );
    document.body.appendChild(el);
    expect(el.querySelectorAll('.expression-slot').length).toBe(3);
    expect(el.textContent).toMatch(/5|2|3|\+/);
  });

  it('renderTargetDisplay + renderChallengeCard remount', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 10, {
      operators: ['+', '-', '*', '/'],
    });
    const target = renderTargetDisplay(challenge);
    expect(target.textContent).toMatch(/10/);
    const card = renderChallengeCard(challenge);
    document.body.appendChild(target);
    document.body.appendChild(card);
    expect(document.body.textContent).toMatch(/10/);
  });

  it('renderCalculatorDisplay mounts value text', () => {
    const el = renderCalculatorDisplay('1+2*3', 7);
    document.body.appendChild(el);
    expect(el.textContent).toMatch(/7/);
  });
});

describe('Wave 22 expression-ui — interactive builder place/reset', () => {
  it('select card → slot place builds expression; reset clears', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const cards = [
      createNumberCard(4, 'n4'),
      createOperatorCard('*', 'op-mul'),
      createNumberCard(5, 'n5'),
    ];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
      targetValue: 20,
    });

    expect(host.querySelector('.target-display')).toBeTruthy();
    expect(api.getExpression().replace(/\s/g, '')).toBe('');
    expect(api.getResult()).toBeNull();

    const trayCards = host.querySelectorAll('.expression-card');
    expect(trayCards.length).toBeGreaterThanOrEqual(3);
    (trayCards[0] as HTMLElement).click();
    const slots = host.querySelectorAll('.expression-slot');
    expect(slots.length).toBe(3);
    (slots[0] as HTMLElement).click();

    (trayCards[1] as HTMLElement).click();
    // Re-query after re-render
    const slots2 = host.querySelectorAll('.expression-slot');
    (slots2[1] as HTMLElement).click();

    const tray2 = host.querySelectorAll(
      '.card-tray .expression-card, .expression-card'
    );
    // Click remaining number if still in tray
    const remaining = [...tray2].find((el) => el.textContent?.includes('5'));
    if (remaining) {
      (remaining as HTMLElement).click();
      const slots3 = host.querySelectorAll('.expression-slot');
      (slots3[2] as HTMLElement).click();
    }

    api.reset();
    expect(api.getExpression().replace(/\s/g, '')).toBe('');
  });
});

describe('Wave 22 expression-ui — deck + validateSlots + solve bridge', () => {
  it('createExpressionDeck / basic cards feed validateSlots + solveTargetChallenge', () => {
    const nums = createBasicNumberCards();
    const ops = createBasicOperatorCards();
    expect(nums).toHaveLength(9);
    expect(ops.length).toBeGreaterThanOrEqual(4);

    const deck = createExpressionDeck({ includeParens: true });
    expect(deck.length).toBeGreaterThan(nums.length);

    const slots = [
      createSlot(0, createNumberCard(6)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(2)),
    ];
    const validation = validateSlots(slots);
    expect(validation.isValid).toBe(true);
    expect(validation.canEvaluate).toBe(true);
    expect(slotsToExpression(slots).replace(/\s/g, '')).toBe('6/2');

    const challenge = createTargetChallenge([2, 2, 2, 2], 8, {
      operators: ['+', '*'],
    });
    const solutions = solveTargetChallenge(challenge, 5);
    expect(solutions.length).toBeGreaterThan(0);
    const check = validateSolution(solutions[0].expression, challenge);
    expect(check.valid).toBe(true);

    const bad = validateSolution('2+2', challenge);
    expect(bad.valid).toBe(false);
  });
});
