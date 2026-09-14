/**
 * Wave 35 — createInteractiveBuilder place / remove / complete / reset.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInteractiveBuilder } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — interactive builder', () => {
  it('places 3+4 to hit target 7 and invokes onComplete', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const completed: Array<{ expr: string; result: number }> = [];
    const cards = [
      createNumberCard(3, 'n3'),
      createOperatorCard('+', 'plus'),
      createNumberCard(4, 'n4'),
      createNumberCard(9, 'n9'),
    ];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
      targetValue: 7,
      onComplete: (expr, result) => completed.push({ expr, result }),
    });

    expect(host.querySelector('.target-display .value')?.textContent).toBe('7');
    expect(host.querySelectorAll('.expression-slot')).toHaveLength(3);

    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];

    tray()
      .find((el) => el.textContent === '3')!
      .click();
    slots()[0].click();
    tray()
      .find((el) => el.textContent === '+')!
      .click();
    slots()[1].click();
    tray()
      .find((el) => el.textContent === '4')!
      .click();
    slots()[2].click();

    expect(api.getExpression()).toBe('3 + 4');
    expect(api.getResult()).toBe(7);
    expect(completed).toEqual([{ expr: '3 + 4', result: 7 }]);
    // used cards disappear from tray
    expect(
      tray()
        .map((el) => el.textContent)
        .sort()
    ).toEqual(['9']);
  });

  it('clicking filled slot removes card back to tray', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const cards = [
      createNumberCard(5, 'n5'),
      createOperatorCard('-', 'minus'),
      createNumberCard(2, 'n2'),
    ];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
    });
    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];

    tray()
      .find((el) => el.textContent === '5')!
      .click();
    slots()[0].click();
    expect(api.getExpression()).toBe('5');
    expect(tray()).toHaveLength(2);
    // Filled slots wire onClick on the inner card, not the slot shell.
    (slots()[0]!.querySelector('.expression-card') as HTMLElement).click();
    expect(api.getExpression()).toBe('');
    expect(tray()).toHaveLength(3);
  });

  it('Clear All button and reset() empty expression', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 2,
      availableCards: [createNumberCard(1, 'a'), createNumberCard(2, 'b')],
    });
    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];
    tray()[0].click();
    slots()[0].click();
    expect(api.getExpression()).not.toBe('');

    const clear = [...host.querySelectorAll('button')].find((b) =>
      /clear/i.test(b.textContent ?? '')
    )!;
    clear.click();
    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(tray()).toHaveLength(2);

    tray()[1].click();
    slots()[0].click();
    api.reset();
    expect(api.getExpression()).toBe('');
  });

  it('toggling same tray card deselects without placing', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveBuilder(host, {
      slotCount: 1,
      availableCards: [createNumberCard(8, 'n8')],
    });
    const trayCard = () =>
      host.querySelector('.card-tray .expression-card') as HTMLElement;
    trayCard().click();
    expect(trayCard().classList.contains('selected')).toBe(true);
    trayCard().click();
    expect(trayCard().classList.contains('selected')).toBe(false);
  });
});
