/**
 * Wave 35 — interactive builder miss-target / incomplete edges.
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

describe('Wave 35 expr-ui — interactive miss edges', () => {
  it('reaching non-target value does not fire onComplete', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(1, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(1, 'b'),
      ],
      targetValue: 99,
      onComplete,
    });
    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];
    tray()
      .find((e) => e.textContent === '1')!
      .click();
    slots()[0]!.click();
    tray()
      .find((e) => e.textContent === '+')!
      .click();
    slots()[1]!.click();
    tray()
      .find((e) => e.textContent === '1')!
      .click();
    slots()[2]!.click();
    expect(api.getResult()).toBe(2);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('incomplete expression yields null result', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(9, 'n9'),
        createOperatorCard('/', 'div'),
      ],
    });
    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];
    tray()
      .find((e) => e.textContent === '9')!
      .click();
    slots()[0]!.click();
    tray()
      .find((e) => e.textContent === '/')!
      .click();
    slots()[1]!.click();
    expect(api.getExpression()).toBe('9 /');
    expect(api.getResult()).toBeNull();
  });
});
