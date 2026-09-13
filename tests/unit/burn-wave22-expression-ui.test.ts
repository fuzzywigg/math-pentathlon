/**
 * Wave 22 — expression-ui cards/slots/builder/tray/target/calculator/interactive.
 * Distinct from expressions.test evaluator and wave 21 fraction-bar / attribute UI.
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
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
  createExpressionDeck,
  MAKE_TEN_CHALLENGES,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 22 expression-ui — cards + slots', () => {
  it('renderCard classes, click, drag, and SVG type colors', () => {
    injectExpressionStyles();
    injectExpressionStyles();

    const clicks: string[] = [];
    const num = createNumberCard(3, 'n3');
    const card = renderCard(num, {
      selected: true,
      draggable: true,
      onClick: (c) => clicks.push(c.id),
    });
    expect(card.classList.contains('expression-card')).toBe(true);
    expect(card.classList.contains('number')).toBe(true);
    expect(card.classList.contains('selected')).toBe(true);
    expect(card.dataset.cardId).toBe('n3');
    card.click();
    expect(clicks).toEqual(['n3']);

    const drag = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(drag, 'dataTransfer', {
      value: { setData: vi.fn() },
    });
    card.dispatchEvent(drag);
    expect(card.classList.contains('dragging')).toBe(true);
    card.dispatchEvent(new Event('dragend'));
    expect(card.classList.contains('dragging')).toBe(false);

    const opSvg = renderCardSVG(createOperatorCard('+', 'op'), 10, 20);
    expect(opSvg.dataset.cardId).toBe('op');
    expect(opSvg.querySelector('text')?.textContent).toBe('+');
    expect(opSvg.getAttribute('transform')).toBe('translate(10, 20)');

    const parenSvg = renderCardSVG(createParenCard(true, 'lp'), 0, 0);
    expect(parenSvg.querySelector('text')?.textContent).toBe('(');
  });

  it('renderSlot empty / filled / locked / highlight contracts', () => {
    const empty = renderSlot(createSlot(0), { highlighted: true });
    expect(empty.classList.contains('expression-slot')).toBe(true);
    expect(empty.classList.contains('highlight')).toBe(true);
    expect(empty.classList.contains('filled')).toBe(false);

    const filled = renderSlot(
      createSlot(1, createNumberCard(5, 'f5')),
      {}
    );
    expect(filled.classList.contains('filled')).toBe(true);
    expect(filled.querySelector('.expression-card')?.textContent).toBe('5');

    const locked = renderSlot(
      createSlot(2, createOperatorCard('-', 'm'), true)
    );
    expect(locked.classList.contains('locked')).toBe(true);
  });
});

describe('Wave 22 expression-ui — builder / tray / challenge displays', () => {
  it('renderExpressionBuilder shows slots and valid result vs target', () => {
    const builder = {
      slots: [
        createSlot(0, createNumberCard(2, 'a')),
        createSlot(1, createOperatorCard('+', 'p')),
        createSlot(2, createNumberCard(3, 'b')),
      ],
      targetValue: 5,
    };
    const el = renderExpressionBuilder(builder, { showResult: true });
    expect(el.querySelectorAll('.expression-slot')).toHaveLength(3);
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.textContent).toMatch(/5/);
  });

  it('renderCardTray skips used ids and marks selection', () => {
    const cards = createExpressionDeck({
      numbers: [1, 2],
      operators: ['+'],
      includeParens: false,
    });
    const clicked: string[] = [];
    const tray = renderCardTray(cards, {
      selectedId: cards[0].id,
      usedIds: new Set([cards[1].id]),
      onClick: (c) => clicked.push(c.id),
    });
    expect(tray.classList.contains('card-tray')).toBe(true);
    const rendered = tray.querySelectorAll('.expression-card');
    expect(rendered).toHaveLength(2);
    expect(tray.querySelector('.selected')?.dataset.cardId).toBe(cards[0].id);
    (rendered[1] as HTMLElement).click();
    expect(clicked).toEqual([cards[2].id]);
  });

  it('renderTargetDisplay and renderChallengeCard surface challenge data', () => {
    const challenge = MAKE_TEN_CHALLENGES[0];
    const display = renderTargetDisplay(challenge);
    expect(display.classList.contains('target-display')).toBe(true);
    expect(display.querySelector('.value')?.textContent).toBe('10');
    expect(display.querySelectorAll('.number-chip')).toHaveLength(
      challenge.numbers.length
    );

    const picks: number[] = [];
    const card = renderChallengeCard(challenge, () => picks.push(1));
    expect(card.classList.contains('challenge-card')).toBe(true);
    expect(card.querySelector('.target')?.textContent).toBe(
      `= ${challenge.target}`
    );
    expect(card.querySelectorAll('.numbers span')).toHaveLength(
      challenge.numbers.length
    );
    card.click();
    expect(picks).toEqual([1]);
  });
});

describe('Wave 22 expression-ui — interactive builder + calculator', () => {
  it('createInteractiveBuilder places cards and evaluates', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const cards = [
      createNumberCard(4, 'n4'),
      createOperatorCard('+', 'op'),
      createNumberCard(6, 'n6'),
    ];
    const completed: Array<{ expr: string; result: number }> = [];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
      targetValue: 10,
      onComplete: (expr, result) => completed.push({ expr, result }),
    });

    expect(host.querySelector('.target-display .value')?.textContent).toBe(
      '10'
    );
    expect(host.querySelectorAll('.expression-slot')).toHaveLength(3);

    const trayCards = () =>
      Array.from(host.querySelectorAll('.card-tray .expression-card'));
    const slots = () =>
      Array.from(host.querySelectorAll('.expression-slot')) as HTMLElement[];

    (trayCards()[0] as HTMLElement).click();
    slots()[0].click();
    (trayCards().find((el) => el.textContent === '+') as HTMLElement).click();
    slots()[1].click();
    (trayCards().find((el) => el.textContent === '6') as HTMLElement).click();
    slots()[2].click();

    expect(api.getExpression()).toBe('4 + 6');
    expect(api.getResult()).toBe(10);
    expect(completed).toEqual([{ expr: '4 + 6', result: 10 }]);

    api.reset();
    // reset clears state but does not re-render until Clear All or next click
    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
  });

  it('renderCalculatorDisplay formats result and error paths', () => {
    const ok = renderCalculatorDisplay('1+2', 3);
    expect(ok.textContent).toContain('1+2');
    expect(ok.textContent).toContain('= 3');

    const err = renderCalculatorDisplay('1/', undefined, 'Incomplete');
    expect(err.textContent).toContain('Incomplete');

    const blank = renderCalculatorDisplay('');
    expect(blank.textContent).toContain('0');
  });
});
