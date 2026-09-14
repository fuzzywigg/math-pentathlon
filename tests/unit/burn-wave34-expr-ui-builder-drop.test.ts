/**
 * Wave 34 — expression builder onDrop wiring + card dragstart leftovers.
 * Complements slot DnD with tray card draggable + builder drop bridge.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  renderCard,
  renderExpressionBuilder,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 34 expr-ui-builder-drop — onDrop + draggable card', () => {
  it('builder forwards onDrop to unlocked slots', () => {
    const drops: string[] = [];
    const el = renderExpressionBuilder(
      {
        slots: [createSlot(0), createSlot(1, createNumberCard(2, 'n2'), true)],
      },
      {
        onDrop: (slot, cardId) => drops.push(`${slot.id}:${cardId}`),
      }
    );
    document.body.appendChild(el);
    const unlocked = el.querySelector(
      '.expression-slot:not(.locked)'
    ) as HTMLElement;
    const locked = el.querySelector('.expression-slot.locked') as HTMLElement;

    const drop = (target: HTMLElement, id: string) => {
      const ev = new Event('drop', {
        bubbles: true,
        cancelable: true,
      }) as DragEvent;
      Object.defineProperty(ev, 'dataTransfer', {
        value: { getData: () => id, setData: () => {} },
      });
      target.dispatchEvent(ev);
    };

    drop(unlocked, 'n9');
    drop(locked, 'n9');
    expect(drops).toEqual([`${unlocked.dataset.slotId}:n9`]);
  });

  it('draggable card sets dataTransfer on dragstart and clears dragging', () => {
    const card = createOperatorCard('-', 'minus');
    const el = renderCard(card, { draggable: true });
    document.body.appendChild(el);
    expect(el.draggable).toBe(true);

    const setData = vi.fn();
    const start = new Event('dragstart', {
      bubbles: true,
      cancelable: true,
    }) as DragEvent;
    Object.defineProperty(start, 'dataTransfer', {
      value: { setData, getData: () => '' },
    });
    el.dispatchEvent(start);
    expect(el.classList.contains('dragging')).toBe(true);
    expect(setData).toHaveBeenCalledWith('text/plain', 'minus');

    el.dispatchEvent(new Event('dragend'));
    expect(el.classList.contains('dragging')).toBe(false);
  });
});
