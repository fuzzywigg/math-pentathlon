/**
 * Wave 34 — expression-ui renderSlot drag/drop leftover edges after #158.
 * Hits dragover / dragleave / drop handlers not covered by wave 22 smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createNumberCard,
  createSlot,
  renderSlot,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function dragEvent(
  type: 'dragover' | 'dragleave' | 'drop',
  data?: string
): DragEvent {
  const ev = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(ev, 'dataTransfer', {
    value: {
      getData: (fmt: string) =>
        fmt === 'text/plain' && data !== undefined ? data : '',
      setData: () => {},
    },
  });
  return ev;
}

describe('Wave 34 expr-ui-slot-dnd — unlocked drop handlers', () => {
  it('dragover highlights; dragleave clears; drop forwards cardId', () => {
    const drops: Array<{ slotId: string; cardId: string }> = [];
    const slot = createSlot(0);
    const el = renderSlot(slot, {
      onDrop: (s, cardId) => drops.push({ slotId: s.id, cardId }),
    });
    document.body.appendChild(el);

    el.dispatchEvent(dragEvent('dragover'));
    expect(el.classList.contains('highlight')).toBe(true);

    el.dispatchEvent(dragEvent('dragleave'));
    expect(el.classList.contains('highlight')).toBe(false);

    el.dispatchEvent(dragEvent('drop', 'card-42'));
    expect(el.classList.contains('highlight')).toBe(false);
    expect(drops).toEqual([{ slotId: slot.id, cardId: 'card-42' }]);
  });

  it('drop with empty dataTransfer payload is a no-op', () => {
    const onDrop = vi.fn();
    const el = renderSlot(createSlot(1), { onDrop });
    el.dispatchEvent(dragEvent('drop', ''));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('locked slots never attach drop handlers', () => {
    const onDrop = vi.fn();
    const locked = createSlot(2, createNumberCard(9, 'n9'), true);
    const el = renderSlot(locked, { onDrop, highlighted: true });
    expect(el.classList.contains('locked')).toBe(true);
    el.dispatchEvent(dragEvent('dragover'));
    el.dispatchEvent(dragEvent('drop', 'n9'));
    expect(onDrop).not.toHaveBeenCalled();
  });
});
