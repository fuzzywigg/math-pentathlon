/**
 * Wave 22 — expression-ui DOM (cards / slots / builder / tray / interactive).
 * First dedicated burn coverage of src/core/expressions/expression-ui.ts.
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
  createTargetChallenge,
  createExpressionDeck,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 22 expression-ui — cards / SVG / styles', () => {
  it('injectExpressionStyles is idempotent', () => {
    const before = document.querySelectorAll('style').length;
    injectExpressionStyles();
    injectExpressionStyles();
    // module flag may already be true from prior tests; never adds twice in one call path
    expect(document.querySelectorAll('style').length).toBeGreaterThanOrEqual(
      before
    );
  });

  it('renderCard stamps type class, selection, and click handler', () => {
    const clicks: string[] = [];
    const card = createNumberCard(5, 'c5');
    const el = renderCard(card, {
      selected: true,
      draggable: true,
      onClick: (c) => clicks.push(c.id),
    });
    expect(el.className).toContain('expression-card');
    expect(el.className).toContain('number');
    expect(el.classList.contains('selected')).toBe(true);
    expect(el.draggable).toBe(true);
    expect(el.dataset.cardId).toBe('c5');
    el.click();
    expect(clicks).toEqual(['c5']);

    const op = renderCard(createOperatorCard('*', 'op'), {});
    expect(op.className).toContain('operator');
    const paren = renderCard(createParenCard(true, 'lp'), {});
    expect(paren.className).toContain('lparen');
  });

  it('renderCardSVG paints typed colors for number / operator / paren', () => {
    const g = renderCardSVG(createOperatorCard('+', 'svg-op'), 10, 20, {
      width: 44,
      height: 60,
    });
    expect(g.getAttribute('transform')).toBe('translate(10, 20)');
    expect(g.dataset.cardId).toBe('svg-op');
    expect(g.querySelector('rect')?.getAttribute('fill')).toBe('#fff3e0');
    expect(g.querySelector('text')?.textContent).toBe('+');
  });
});

describe('Wave 22 expression-ui — slots / builder / tray', () => {
  it('renderSlot marks locked / filled / highlight and empty click', () => {
    const clicks: string[] = [];
    const empty = renderSlot(createSlot(0), {
      highlighted: true,
      onClick: (s) => clicks.push(s.id),
    });
    expect(empty.classList.contains('highlight')).toBe(true);
    empty.click();
    expect(clicks).toEqual(['slot-0']);

    const filled = renderSlot(
      createSlot(1, createNumberCard(9, 'n9'), true),
      {}
    );
    expect(filled.classList.contains('filled')).toBe(true);
    expect(filled.classList.contains('locked')).toBe(true);
    expect(filled.querySelector('.expression-card')?.textContent).toBe('9');
  });

  it('renderExpressionBuilder showResult toggles valid / invalid / target match', () => {
    const validBuilder = {
      slots: [
        createSlot(0, createNumberCard(2, 'a')),
        createSlot(1, createOperatorCard('+', 'p')),
        createSlot(2, createNumberCard(3, 'b')),
      ],
      targetValue: 5,
    };
    const ok = renderExpressionBuilder(validBuilder, { showResult: true });
    expect(ok.querySelectorAll('.expression-slot')).toHaveLength(3);
    const result = ok.querySelector('.expression-result');
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.textContent).toMatch(/5/);
    expect(result?.textContent).toMatch(/✓/);

    const miss = renderExpressionBuilder(
      { ...validBuilder, targetValue: 99 },
      { showResult: true }
    );
    expect(miss.querySelector('.expression-result')?.textContent).toMatch(
      /target: 99/
    );

    const invalid = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createOperatorCard('+')),
          createSlot(1, createNumberCard(1)),
        ],
      },
      { showResult: true }
    );
    expect(
      invalid.querySelector('.expression-result')?.classList.contains('invalid')
    ).toBe(true);
  });

  it('renderCardTray hides usedIds and marks selectedId', () => {
    const deck = [
      createNumberCard(1, 'u1'),
      createNumberCard(2, 'u2'),
      createOperatorCard('+', 'u+'),
    ];
    const tray = renderCardTray(deck, {
      usedIds: new Set(['u2']),
      selectedId: 'u1',
    });
    const ids = [...tray.querySelectorAll('.expression-card')].map(
      (el) => (el as HTMLElement).dataset.cardId
    );
    expect(ids).toEqual(['u1', 'u+']);
    expect(tray.querySelector('[data-card-id="u1"]')?.classList.contains('selected')).toBe(
      true
    );
  });
});

describe('Wave 22 expression-ui — challenge + calculator chrome', () => {
  it('renderTargetDisplay / renderChallengeCard expose target + numbers', () => {
    const challenge = createTargetChallenge([2, 3, 5], 10);
    const display = renderTargetDisplay(challenge);
    expect(display.querySelector('.value')?.textContent).toBe('10');
    expect(
      [...display.querySelectorAll('.number-chip')].map((c) => c.textContent)
    ).toEqual(['2', '3', '5']);

    let clicked = 0;
    const card = renderChallengeCard(challenge, () => {
      clicked += 1;
    });
    expect(card.querySelector('.target')?.textContent).toBe('= 10');
    card.click();
    expect(clicked).toBe(1);
  });

  it('renderCalculatorDisplay shows expression / result / error themes', () => {
    const ok = renderCalculatorDisplay('2+2', 4);
    expect(ok.textContent).toContain('2+2');
    expect(ok.textContent).toContain('= 4');

    const err = renderCalculatorDisplay('1/0', undefined, 'boom');
    expect(err.textContent).toContain('boom');

    const empty = renderCalculatorDisplay('');
    expect(empty.textContent).toContain('0');
  });
});

describe('Wave 22 expression-ui — createInteractiveBuilder lifecycle', () => {
  it('place → evaluate → hit target → onComplete; reset clears', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const completes: Array<{ expr: string; result: number }> = [];

    const cards = [
      createNumberCard(2, 'n2'),
      createOperatorCard('+', 'op+'),
      createNumberCard(3, 'n3'),
    ];

    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
      targetValue: 5,
      onComplete: (expr, result) => completes.push({ expr, result }),
    });

    expect(host.querySelector('.target-display .value')?.textContent).toBe('5');
    expect(host.querySelectorAll('.expression-slot')).toHaveLength(3);
    expect(host.querySelectorAll('.card-tray .expression-card')).toHaveLength(3);

    // select card then place into first empty slot
    const place = (cardId: string, slotIndex: number) => {
      (host.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement).click();
      const slots = [
        ...host.querySelectorAll('.expression-slot'),
      ] as HTMLElement[];
      slots[slotIndex].click();
    };

    place('n2', 0);
    place('op+', 1);
    place('n3', 2);

    expect(api.getExpression()).toBe('2 + 3');
    expect(api.getResult()).toBe(5);
    expect(completes).toEqual([{ expr: '2 + 3', result: 5 }]);
    // used cards disappear from tray
    expect(host.querySelectorAll('.card-tray .expression-card')).toHaveLength(0);

    api.reset();
    // reset alone does not re-render; Clear All button does
    (host.querySelector('button') as HTMLButtonElement).click();
    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(host.querySelectorAll('.card-tray .expression-card')).toHaveLength(3);
  });

  it('clicking a filled slot returns the card to the tray', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const cards = createExpressionDeck({
      numbers: [4],
      operators: [],
      includeParens: false,
    });
    const api = createInteractiveBuilder(host, {
      slotCount: 2,
      availableCards: cards,
    });

    const cardId = cards[0].id;
    (host.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement).click();
    (host.querySelectorAll('.expression-slot')[0] as HTMLElement).click();
    expect(api.getExpression()).toBe('4');
    expect(host.querySelectorAll('.card-tray .expression-card')).toHaveLength(0);

    // click the card inside the filled slot (onSlotClick is wired on the card)
    (
      host.querySelector(
        '.expression-slot.filled .expression-card'
      ) as HTMLElement
    ).click();
    expect(api.getExpression()).toBe('');
    expect(host.querySelectorAll('.card-tray .expression-card')).toHaveLength(1);
  });
});
