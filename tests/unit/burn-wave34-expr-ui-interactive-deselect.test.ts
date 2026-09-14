/**
 * Wave 34 — interactive builder deselect / no-target leftovers.
 * Covers tray toggle-off and builders without targetValue chrome.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createInteractiveBuilder,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('style')
    .forEach((el) => {
      if (el.textContent?.includes('expression-card')) el.remove();
    });
});

describe('Wave 34 expr-ui-interactive — deselect + no target', () => {
  it('re-clicking selected tray card clears selection without placing', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveBuilder(host, {
      slotCount: 2,
      availableCards: [createNumberCard(8, 'n8'), createNumberCard(1, 'n1')],
      targetValue: 9,
    });

    const first = host.querySelector(
      '.card-tray .expression-card'
    ) as HTMLElement;
    first.click();
    expect(first.classList.contains('selected') || host.querySelector('.selected')).toBeTruthy();

    // Re-query after re-render
    const again = host.querySelector(
      '.card-tray .expression-card'
    ) as HTMLElement;
    again.click();
    expect(host.querySelector('.card-tray .selected')).toBeNull();
    expect(
      host.querySelector('.expression-slot.filled')
    ).toBeNull();
  });

  it('omitting targetValue skips target display and never fires onComplete', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const completed: string[] = [];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(1, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(1, 'b'),
      ],
      onComplete: (expr) => completed.push(expr),
    });

    expect(host.querySelector('.target-display')).toBeNull();

    const tray = () =>
      Array.from(host.querySelectorAll('.card-tray .expression-card'));
    const slots = () =>
      Array.from(host.querySelectorAll('.expression-slot')) as HTMLElement[];

    tray()[0].click();
    slots()[0].click();
    tray().find((el) => el.textContent === '+')!.click();
    slots()[1].click();
    tray().find((el) => el.textContent === '1')!.click();
    slots()[2].click();

    expect(api.getExpression()).toBe('1 + 1');
    expect(api.getResult()).toBe(2);
    expect(completed).toEqual([]);
  });

  it('getResult returns null for incomplete / invalid builder state', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 2,
      availableCards: [createOperatorCard('+', 'op')],
    });
    const card = host.querySelector(
      '.card-tray .expression-card'
    ) as HTMLElement;
    card.click();
    (host.querySelector('.expression-slot') as HTMLElement).click();
    expect(api.getExpression()).toBe('+');
    expect(api.getResult()).toBeNull();
  });
});
