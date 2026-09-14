/**
 * Wave 34 — createInteractiveBuilder remove-from-slot + Clear All leftovers.
 * Deepens wave 22 place-only smoke into remove / reset-button paths.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

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
  vi.restoreAllMocks();
});

function trayCards(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll('.card-tray .expression-card'));
}

function slots(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll('.expression-slot'));
}

describe('Wave 34 expr-ui-interactive — remove + Clear All', () => {
  it('clicking a filled unlocked slot returns the card to the tray', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const cards = [
      createNumberCard(3, 'n3'),
      createOperatorCard('+', 'op'),
      createNumberCard(4, 'n4'),
    ];
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: cards,
      targetValue: 7,
    });

    trayCards(host)[0].click();
    slots(host)[0].click();
    expect(api.getExpression()).toBe('3');
    expect(trayCards(host)).toHaveLength(2);

    // Click nested card (slot shell itself has no listener when filled)
    const filledCard = slots(host)[0].querySelector(
      '.expression-card'
    ) as HTMLElement;
    filledCard.click();
    expect(api.getExpression()).toBe('');
    expect(trayCards(host)).toHaveLength(3);
  });

  it('Clear All button resets expression via DOM control', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(2, 'a'),
        createOperatorCard('*', 'm'),
        createNumberCard(5, 'b'),
      ],
      targetValue: 10,
    });

    trayCards(host)[0].click();
    slots(host)[0].click();
    expect(api.getExpression()).toBe('2');

    const clearBtn = [...host.querySelectorAll('button')].find((b) =>
      /clear all/i.test(b.textContent ?? '')
    );
    expect(clearBtn).toBeTruthy();
    clearBtn!.click();
    expect(api.getExpression()).toBe('');
    expect(trayCards(host)).toHaveLength(3);
    expect(host.querySelector('.expression-result')?.textContent).toMatch(
      /No cards placed/i
    );
  });
});
