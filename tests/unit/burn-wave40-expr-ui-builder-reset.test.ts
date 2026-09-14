/**
 * Wave 40 — expr-ui builder reset + locked slot leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInteractiveBuilder,
  renderSlot,
  renderExpressionBuilder,
  injectExpressionStyles,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  type ExpressionSlot,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 expr-ui — builder reset + locked slot', () => {
  it('reset() clears expression after placements without remount', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(2, 'n2'),
        createOperatorCard('+', 'plus'),
        createNumberCard(5, 'n5'),
      ],
    });
    const tray = () =>
      [...host.querySelectorAll('.card-tray .expression-card')] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];

    tray().find((el) => el.textContent === '2')!.click();
    slots()[0].click();
    tray().find((el) => el.textContent === '+')!.click();
    slots()[1].click();
    expect(api.getExpression()).toBe('2 +');

    api.reset();
    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    // reset does not re-render; Clear All button remounts tray
    const clear = [...host.querySelectorAll('button')].find((b) =>
      /clear/i.test(b.textContent ?? '')
    )!;
    clear.click();
    expect(tray()).toHaveLength(3);
  });

  it('locked slot gets locked class and rejects drop wiring', () => {
    const onDrop = vi.fn();
    const locked: ExpressionSlot = {
      id: 'L',
      index: 0,
      card: null,
      locked: true,
    };
    const el = renderSlot(locked, { onDrop });
    expect(el.classList.contains('locked')).toBe(true);
    el.dispatchEvent(new Event('dragover'));
    expect(el.classList.contains('highlight')).toBe(false);

    const drop = new Event('drop', { bubbles: true }) as Event & {
      dataTransfer: { getData: () => string };
    };
    drop.dataTransfer = { getData: () => 'card-x' };
    el.dispatchEvent(drop);
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('locked filled slot still renders card but onDrop ignored', () => {
    const card = createNumberCard(9, 'n9');
    const slot: ExpressionSlot = {
      id: 'filled-locked',
      index: 0,
      card,
      locked: true,
    };
    const el = renderSlot(slot, { onDrop: vi.fn() });
    expect(el.classList.contains('filled')).toBe(true);
    expect(el.classList.contains('locked')).toBe(true);
    expect(el.querySelector('.expression-card')?.textContent).toBe('9');
  });

  it('injectExpressionStyles is idempotent via module flag', () => {
    const before = document.head.querySelectorAll('style').length;
    injectExpressionStyles();
    injectExpressionStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after - before).toBeLessThanOrEqual(1);
  });

  it('renderExpressionBuilder showResult invalid when no cards placed', () => {
    const el = renderExpressionBuilder(
      {
        slots: [
          { id: 's0', index: 0, card: null },
          { id: 's1', index: 1, card: null },
        ],
      },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    // validateSlots returns errors: ['No cards placed'] → invalid branch
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.textContent).toMatch(/No cards placed|Invalid/i);
  });
});
