/**
 * q-mp-406 — Characterize expression-ui drop / slot / empty-card soft-fail residuals.
 *
 * Tip-base (post865) characterization beyond tip-contained q-mp-326 (#818).
 * Structural asserts only — no player-facing copy pins. Tests only; no src edits.
 *
 * Pins soft contracts around the 7 nnnull sites so q-mp-396 (nnnull clear) can
 * land without guessing drop / slot / empty-card behavior.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as evaluator from '../../src/core/expressions/evaluator';
import {
  createInteractiveBuilder,
  renderCard,
  renderCardTray,
  renderExpressionBuilder,
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

function dropEvent(dataTransfer: DataTransfer | null): Event {
  const ev = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'dataTransfer', { value: dataTransfer });
  return ev;
}

describe('q-mp-406 expression-ui — drop soft-fail residuals', () => {
  it('drop with null dataTransfer is a soft no-op (onDrop! not reached)', () => {
    const onDrop = vi.fn();
    const el = renderSlot(createSlot(0), { onDrop });
    el.dispatchEvent(dropEvent(null));
    expect(onDrop).not.toHaveBeenCalled();
    expect(el.classList.contains('highlight')).toBe(false);
  });

  it('builder onDrop soft-skips when dataTransfer is null', () => {
    const onDrop = vi.fn();
    const el = renderExpressionBuilder(
      { slots: [createSlot(0), createSlot(1)] },
      { onDrop }
    );
    const slot0 = el.querySelector('.expression-slot') as HTMLElement;
    expect(slot0).toBeTruthy();
    slot0.dispatchEvent(dropEvent(null));
    expect(onDrop).not.toHaveBeenCalled();
    expect(slot0.classList.contains('highlight')).toBe(false);
  });

  it('highlighted empty slot without onDrop never attaches drop handlers', () => {
    const el = renderSlot(createSlot(2), { highlighted: true });
    expect(el.classList.contains('highlight')).toBe(true);
    const onDrop = vi.fn();
    // No onDrop option → dispatch is inert (handlers never registered).
    el.dispatchEvent(
      dropEvent({
        getData: () => 'ghost',
        setData: () => undefined,
        clearData: () => undefined,
        dropEffect: 'none',
        effectAllowed: 'all',
        files: {} as FileList,
        items: {} as DataTransferItemList,
        types: [],
      } as DataTransfer)
    );
    expect(onDrop).not.toHaveBeenCalled();
    expect(el.classList.contains('highlight')).toBe(true);
  });
});

describe('q-mp-406 expression-ui — empty-slot / empty-card soft paths', () => {
  it('empty slot without onClick has no pointer cursor and click is inert', () => {
    const el = renderSlot(createSlot(4));
    expect(el.classList.contains('filled')).toBe(false);
    expect(el.style.cursor).not.toBe('pointer');
    expect(() => el.click()).not.toThrow();
    expect(el.querySelector('.expression-card')).toBeNull();
  });

  it('empty availableCards tray mounts card-tray with zero cards', () => {
    const tray = renderCardTray([], { draggable: true, onClick: vi.fn() });
    expect(tray.classList.contains('card-tray')).toBe(true);
    expect(tray.querySelectorAll('.expression-card')).toHaveLength(0);
  });

  it('card onClick! fires only when handler provided (nnnull site L286)', () => {
    const seen: string[] = [];
    const withHandler = renderCard(createNumberCard(3, 'c3'), {
      onClick: (card) => seen.push(card.id),
    });
    withHandler.click();
    expect(seen).toEqual(['c3']);

    const bare = renderCard(createOperatorCard('-', 'op-minus'));
    expect(() => bare.click()).not.toThrow();
    expect(seen).toEqual(['c3']);
  });

  it('filled-slot card click forwards to onClick!(slot) (nnnull site L378)', () => {
    const clicked: string[] = [];
    const slot = createSlot(0, createNumberCard(11, 'n11'));
    const el = renderSlot(slot, {
      onClick: (s) => clicked.push(s.id),
    });
    const card = el.querySelector('[data-card-id="n11"]') as HTMLElement;
    expect(card).toBeTruthy();
    card.click();
    expect(clicked).toEqual([slot.id]);
  });
});

describe('q-mp-406 expression-ui — getExpression / getResult soft contracts', () => {
  it('sparse slots filter empties before card!.content (nnnull sites L741/L750)', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(2, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(5, 'b'),
      ],
    });

    const pick = (id: string) =>
      host.querySelector(`.card-tray [data-card-id="${id}"]`) as HTMLElement;
    const slots = () =>
      Array.from(host.querySelectorAll('.expression-slot')) as HTMLElement[];

    // Fill slot 0 and slot 2 only — middle stays empty.
    pick('a').click();
    slots()[0]!.click();
    pick('b').click();
    slots()[2]!.click();

    expect(host.querySelectorAll('.expression-slot.filled')).toHaveLength(2);
    expect(api.getExpression()).toBe('2 5');
    expect(api.getResult()).toBeNull();
  });

  it('getResult returns null when evaluate soft-fails (success: false)', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 1,
      availableCards: [createNumberCard(4, 'n4')],
    });
    const card = host.querySelector(
      '.card-tray [data-card-id="n4"]'
    ) as HTMLElement;
    const slot = host.querySelector('.expression-slot') as HTMLElement;
    card.click();
    slot.click();
    expect(api.getExpression()).toBe('4');

    vi.spyOn(evaluator, 'evaluate').mockReturnValue({
      success: false,
      error: 'boom',
    });
    expect(api.getResult()).toBeNull();
  });

  it('truthy drop cardId reaches onDrop! (nnnull site L404) once', () => {
    const drops: string[] = [];
    const el = renderSlot(createSlot(1), {
      onDrop: (_slot, cardId) => drops.push(cardId),
    });
    el.dispatchEvent(
      dropEvent({
        getData: (fmt: string) => (fmt === 'text/plain' ? 'card-z' : ''),
        setData: () => undefined,
        clearData: () => undefined,
        dropEffect: 'move',
        effectAllowed: 'all',
        files: {} as FileList,
        items: {} as DataTransferItemList,
        types: ['text/plain'],
      } as DataTransfer)
    );
    expect(drops).toEqual(['card-z']);
  });
});
