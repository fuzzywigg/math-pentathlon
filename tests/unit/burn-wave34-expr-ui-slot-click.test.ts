/**
 * Wave 34 — expression-ui renderSlot click forwarding leftovers.
 * Filled-card onClick + empty-slot onClick not exercised after wave 22.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  renderSlot,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 34 expr-ui-slot-click — filled card forwards onClick', () => {
  it('clicking nested card invokes options.onClick with the slot', () => {
    const clicked: string[] = [];
    const slot = createSlot(0, createNumberCard(7, 'n7'));
    const el = renderSlot(slot, {
      onClick: (s) => clicked.push(s.id),
    });
    document.body.appendChild(el);
    const card = el.querySelector('.expression-card') as HTMLElement;
    expect(card).toBeTruthy();
    card.click();
    expect(clicked).toEqual([slot.id]);
  });

  it('empty slot click fires when onClick provided', () => {
    const clicked: string[] = [];
    const slot = createSlot(3);
    const el = renderSlot(slot, {
      onClick: (s) => clicked.push(s.id),
    });
    expect(el.style.cursor).toBe('pointer');
    el.click();
    expect(clicked).toEqual([slot.id]);
  });

  it('filled slot without onClick still mounts card chrome', () => {
    const slot = createSlot(1, createOperatorCard('+', 'op'));
    const el = renderSlot(slot);
    expect(el.classList.contains('filled')).toBe(true);
    expect(el.querySelector('.expression-card')?.textContent).toBe('+');
  });
});
