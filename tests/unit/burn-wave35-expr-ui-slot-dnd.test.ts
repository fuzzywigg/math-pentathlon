/**
 * Wave 35 — renderSlot empty/filled/locked + drag-drop edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { renderSlot } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — slot states', () => {
  it('empty highlighted slot is clickable', () => {
    const clicks: number[] = [];
    const el = renderSlot(createSlot(0), {
      highlighted: true,
      onClick: (s) => clicks.push(s.index),
    });
    expect(el.classList.contains('highlight')).toBe(true);
    expect(el.classList.contains('filled')).toBe(false);
    el.click();
    expect(clicks).toEqual([0]);
  });

  it('filled slot embeds card and routes onClick to slot', () => {
    const hits: string[] = [];
    const slot = createSlot(1, createNumberCard(8, 'n8'));
    const el = renderSlot(slot, {
      onClick: (s) => hits.push(s.card!.id),
    });
    expect(el.classList.contains('filled')).toBe(true);
    el.querySelector('.expression-card')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(hits).toEqual(['n8']);
  });

  it('locked filled slot exposes locked class', () => {
    const el = renderSlot(createSlot(2, createOperatorCard('+', 'p'), true));
    expect(el.classList.contains('locked')).toBe(true);
    expect(el.classList.contains('filled')).toBe(true);
  });
});

describe('Wave 35 expr-ui — slot drop', () => {
  it('drop delivers cardId when unlocked', () => {
    const drops: string[] = [];
    const el = renderSlot(createSlot(0), {
      onDrop: (_s, id) => drops.push(id),
    });
    const over = new Event('dragover', { bubbles: true, cancelable: true });
    el.dispatchEvent(over);
    expect(el.classList.contains('highlight')).toBe(true);
    el.dispatchEvent(new Event('dragleave'));
    expect(el.classList.contains('highlight')).toBe(false);

    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { getData: () => 'card-xyz' },
    });
    el.dispatchEvent(drop);
    expect(drops).toEqual(['card-xyz']);
  });

  it('locked slot does not wire drop handler', () => {
    const drops: string[] = [];
    const el = renderSlot(createSlot(0, createNumberCard(1, 'n'), true), {
      onDrop: (_s, id) => drops.push(id),
    });
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { getData: () => 'nope' },
    });
    el.dispatchEvent(drop);
    expect(drops).toEqual([]);
  });
});
