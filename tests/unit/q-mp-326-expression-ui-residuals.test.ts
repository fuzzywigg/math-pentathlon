/**
 * q-mp-326 — Characterize expression-ui soft-fail / enable-disable / render residuals.
 *
 * Tests only. Structural asserts (classes, dataset ids, callback counts, null results).
 * No player-facing copy pins. Orthogonal to mutation-ui8 (#778 / wave 8 SVG pins) and
 * mutation-ui9 (#814 attribute/fraction/dice — disjoint hosts).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as evaluator from '../../src/core/expressions/evaluator';
import {
  createInteractiveBuilder,
  renderCard,
  renderCardTray,
  renderChallengeCard,
  renderExpressionBuilder,
  renderSlot,
  renderTargetDisplay,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  createTargetChallenge,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('q-mp-326 expression-ui — showResult soft-fail residuals', () => {
  it('canEvaluate without result uses neutral result chrome (empty-build residual)', () => {
    // Live validateSlots always sets result when canEvaluate; pin the UI residual
    // when the contract returns canEvaluate with an absent numeric result.
    const spy = vi.spyOn(evaluator, 'validateSlots').mockReturnValue({
      isValid: true,
      canEvaluate: true,
      errors: [],
    });

    const el = renderExpressionBuilder(
      { slots: [createSlot(0, createNumberCard(1, 'n1'))] },
      { showResult: true }
    );
    expect(spy).toHaveBeenCalled();
    const result = el.querySelector('.expression-result');
    expect(result).toBeTruthy();
    expect(result!.classList.contains('neutral')).toBe(true);
    expect(result!.classList.contains('valid')).toBe(false);
    expect(result!.classList.contains('invalid')).toBe(false);
    // Evaluable path injects a <strong>; residual empty-build path does not.
    expect(result!.querySelector('strong')).toBeNull();
    expect((result!.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('empty-string validation error still paints invalid chrome via fallback', () => {
    const spy = vi.spyOn(evaluator, 'validateSlots').mockReturnValue({
      isValid: false,
      canEvaluate: false,
      errors: [''],
    });

    const el = renderExpressionBuilder(
      { slots: [createSlot(0, createNumberCard(2, 'n2'))] },
      { showResult: true }
    );
    expect(spy).toHaveBeenCalled();
    const result = el.querySelector('.expression-result');
    expect(result!.classList.contains('invalid')).toBe(true);
    // Fallback must yield non-empty chrome when errors[0] is falsy.
    expect((result!.textContent ?? '').length).toBeGreaterThan(0);
  });
});

describe('q-mp-326 expression-ui — interactive soft no-ops / getResult', () => {
  it('clicking an empty slot with no selection is a soft no-op', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(3, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(4, 'b'),
      ],
      targetValue: 7,
      onComplete,
    });

    const trayBefore = host.querySelectorAll(
      '.card-tray .expression-card'
    ).length;
    const emptySlot = host.querySelector(
      '.expression-slot:not(.filled)'
    ) as HTMLElement;
    expect(emptySlot).toBeTruthy();
    emptySlot.click();

    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(onComplete).not.toHaveBeenCalled();
    expect(host.querySelectorAll('.card-tray .expression-card').length).toBe(
      trayBefore
    );
    expect(host.querySelectorAll('.expression-slot.filled').length).toBe(0);
  });

  it('getResult returns null when evaluate succeeds without a numeric value', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 1,
      availableCards: [createNumberCard(5, 'n5')],
    });

    const card = host.querySelector(
      '.card-tray [data-card-id="n5"]'
    ) as HTMLElement;
    const slot = host.querySelector('.expression-slot') as HTMLElement;
    card.click();
    slot.click();
    expect(api.getExpression()).toBe('5');

    vi.spyOn(evaluator, 'evaluate').mockReturnValue({ success: true });
    expect(api.getResult()).toBeNull();
  });

  it('deselecting a tray card clears selected chrome without placing', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveBuilder(host, {
      slotCount: 2,
      availableCards: [createNumberCard(8, 'n8'), createNumberCard(9, 'n9')],
    });

    const card = () =>
      host.querySelector('.card-tray [data-card-id="n8"]') as HTMLElement;
    card().click();
    expect(card().classList.contains('selected')).toBe(true);
    card().click();
    expect(card().classList.contains('selected')).toBe(false);
    expect(host.querySelectorAll('.expression-slot.filled').length).toBe(0);
  });
});

describe('q-mp-326 expression-ui — enable-disable / render edges', () => {
  it('locked slot keeps drop disabled (no onDrop) while filled card still renders', () => {
    const onDrop = vi.fn();
    const card = createNumberCard(6, 'locked-6');
    const el = renderSlot(createSlot(0, card, true), { onDrop });
    expect(el.classList.contains('locked')).toBe(true);
    expect(el.classList.contains('filled')).toBe(true);
    expect(el.querySelector('[data-card-id="locked-6"]')).toBeTruthy();

    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { getData: () => 'other' },
    });
    el.dispatchEvent(drop);
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('draggable false leaves HTML draggable unset (interaction disabled)', () => {
    const el = renderCard(createNumberCard(1, 'd1'), { draggable: false });
    expect(el.draggable).toBe(false);
    expect(el.classList.contains('dragging')).toBe(false);
  });

  it('dragstart with null dataTransfer is a soft no-op (optional chaining)', () => {
    const el = renderCard(createNumberCard(2, 'd2'), { draggable: true });
    expect(el.draggable).toBe(true);
    const start = new Event('dragstart', { bubbles: true, cancelable: true });
    Object.defineProperty(start, 'dataTransfer', { value: null });
    expect(() => el.dispatchEvent(start)).not.toThrow();
    expect(el.classList.contains('dragging')).toBe(true);
    el.dispatchEvent(new Event('dragend'));
    expect(el.classList.contains('dragging')).toBe(false);
  });

  it('usedIds disables every tray card (empty tray render edge)', () => {
    const cards = [
      createNumberCard(1, 'u1'),
      createNumberCard(2, 'u2'),
      createOperatorCard('*', 'um'),
    ];
    const tray = renderCardTray(cards, {
      usedIds: new Set(cards.map((c) => c.id)),
      draggable: true,
    });
    expect(tray.classList.contains('card-tray')).toBe(true);
    expect(tray.querySelectorAll('.expression-card').length).toBe(0);
  });

  it('challenge card without onClick stays non-interactive (no handler)', () => {
    const challenge = createTargetChallenge([1, 2, 3, 4], 10);
    const el = renderChallengeCard(challenge);
    expect(el.classList.contains('challenge-card')).toBe(true);
    expect(el.querySelectorAll('.numbers span').length).toBe(4);
    el.click();
    expect(el.classList.contains('challenge-card')).toBe(true);
  });

  it('target display with empty numbers list renders value only', () => {
    const el = renderTargetDisplay({
      target: 12,
      numbers: [],
      operators: ['+', '-'],
      useAllNumbers: false,
      useEachOnce: true,
    });
    expect(el.classList.contains('target-display')).toBe(true);
    expect(el.querySelector('.value')?.textContent).toBe('12');
    expect(el.querySelectorAll('.number-chip').length).toBe(0);
  });
});
