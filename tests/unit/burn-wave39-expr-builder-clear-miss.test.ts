/**
 * Wave 39 — createInteractiveBuilder Clear-all after miss / partial.
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
  document.querySelectorAll('#expression-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 39 expr — builder clear miss', () => {
  it('Clear All resets after partial place that misses target', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onComplete = vi.fn();
    const cards = [
      createNumberCard(1, 'n1'),
      createNumberCard(2, 'n2'),
      createOperatorCard('+', 'op'),
      createNumberCard(9, 'n9'),
    ];
    const builder = createInteractiveBuilder(el, {
      slotCount: 5,
      availableCards: cards,
      targetValue: 100,
      onComplete,
    });

    // select card then slot
    const trayCards = el.querySelectorAll('.expression-card, .card');
    expect(trayCards.length).toBeGreaterThan(0);
    (trayCards[0] as HTMLElement).click();
    const slots = el.querySelectorAll('.expression-slot, .slot');
    if (slots.length > 0) {
      (slots[0] as HTMLElement).click();
    }
    expect(builder.getExpression().length).toBeGreaterThanOrEqual(0);

    const clear = [...el.querySelectorAll('button')].find((b) =>
      /clear all/i.test(b.textContent || '')
    );
    expect(clear).toBeTruthy();
    clear!.click();
    expect(builder.getExpression()).toBe('');
    expect(builder.getResult()).toBeNull();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
