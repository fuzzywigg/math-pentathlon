/**
 * q-mp-662 — Close `expression-ui` residual gaps under the verify glob
 * `tests/unit/*expression-ui*` (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`):
 * - With `*expression-ui*` suites: **97.0%** lines / **96.87%** branches
 * - Uncovered stmt clusters: ~396, 531, 675–677, 725–726
 *   (dragleave body; tray `draggable !== undefined`; interactive remove;
 *   Clear All click → reset+render)
 *
 * Ownership (leave alone; do not edit product / competing suites):
 * - `#1027` / q-mp-570 DISPLAY soft-fail — leave open (**contained**)
 * - `#885` / q-mp-406 drop/slot/empty — leave open (**contained**)
 * - `#818` / q-mp-326 soft-fail residuals — leave open (**contained**)
 * - undrafted `q-mp-396` nnnull — leave (**contained**); no ceiling write
 * - engine r20 / wave34–35 cover some of these paths outside the
 *   `*expression-ui*` glob
 *
 * Constraints: tests only; zero `src/`; DISPLAY chrome only — no evaluator /
 * scoring value asserts; no AI / rules / legal-move / copy / aria pins;
 * no network; no ratchet JSON.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createInteractiveBuilder,
  renderCardTray,
  renderSlot,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function dragEvent(type: 'dragover' | 'dragleave' | 'drop'): Event {
  const ev = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'dataTransfer', {
    value: {
      getData: () => '',
      setData: () => undefined,
    },
  });
  return ev;
}

function trayCards(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll('.card-tray .expression-card'));
}

function slots(host: HTMLElement): HTMLElement[] {
  return Array.from(host.querySelectorAll('.expression-slot'));
}

describe('q-mp-662 expression-ui — dragleave residual (~396)', () => {
  it('unlocked onDrop slot clears highlight on dragleave', () => {
    const el = renderSlot(createSlot(0), {
      onDrop: () => undefined,
    });
    document.body.appendChild(el);

    expect(el.classList.contains('highlight')).toBe(false);
    el.dispatchEvent(dragEvent('dragover'));
    expect(el.classList.contains('highlight')).toBe(true);

    el.dispatchEvent(dragEvent('dragleave'));
    expect(el.classList.contains('highlight')).toBe(false);
  });
});

describe('q-mp-662 expression-ui — tray draggable residual (~531)', () => {
  it('renderCardTray with draggable true forwards to rendered cards', () => {
    const cards = [
      createNumberCard(3, 'q662-n3'),
      createOperatorCard('+', 'q662-op'),
    ];
    const tray = renderCardTray(cards, { draggable: true });
    const rendered = [
      ...tray.querySelectorAll('.expression-card'),
    ] as HTMLElement[];
    expect(rendered).toHaveLength(2);
    expect(rendered.every((c) => c.draggable === true)).toBe(true);
  });

  it('renderCardTray with draggable false leaves HTML draggable unset', () => {
    const tray = renderCardTray([createNumberCard(8, 'q662-n8')], {
      draggable: false,
    });
    const card = tray.querySelector('.expression-card') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.draggable).toBe(false);
  });
});

describe('q-mp-662 expression-ui — interactive remove residual (~675–677)', () => {
  it('clicking a filled unlocked slot returns the card to the tray', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(3, 'q662-a'),
        createOperatorCard('+', 'q662-p'),
        createNumberCard(4, 'q662-b'),
      ],
      targetValue: 7,
    });

    const placeCard = host.querySelector(
      '.card-tray [data-card-id="q662-a"]'
    ) as HTMLElement;
    expect(placeCard).toBeTruthy();
    placeCard.click();
    slots(host)[0].click();
    expect(api.getExpression()).not.toBe('');
    expect(trayCards(host)).toHaveLength(2);
    expect(slots(host)[0].classList.contains('filled')).toBe(true);

    // Filled slots wire onClick on the inner card, not the slot shell.
    const filledCard = slots(host)[0].querySelector(
      '.expression-card'
    ) as HTMLElement;
    expect(filledCard).toBeTruthy();
    filledCard.click();

    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(trayCards(host)).toHaveLength(3);
    expect(slots(host)[0].classList.contains('filled')).toBe(false);
  });
});

describe('q-mp-662 expression-ui — Clear All residual (~725–726)', () => {
  it('sole builder button remounts empty slots and full tray', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(2, 'q662-c'),
        createOperatorCard('*', 'q662-m'),
        createNumberCard(5, 'q662-d'),
      ],
      targetValue: 10,
    });

    const placeCard = host.querySelector(
      '.card-tray [data-card-id="q662-c"]'
    ) as HTMLElement;
    placeCard.click();
    slots(host)[0].click();
    expect(api.getExpression()).not.toBe('');
    expect(trayCards(host)).toHaveLength(2);

    // Interactive builder mounts exactly one control button (Clear All).
    const clearBtn = host.querySelector('button');
    expect(clearBtn).toBeTruthy();
    clearBtn!.click();

    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(trayCards(host)).toHaveLength(3);
    expect(host.querySelectorAll('.expression-slot.filled')).toHaveLength(0);
    expect(host.querySelector('.expression-result')).toBeTruthy();
  });
});
