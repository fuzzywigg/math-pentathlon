/**
 * q-mp-569 mutation audit UI wave 20 — expression-ui first-20 re-pins.
 * Structural / numeric / boolean pins only — no player-facing copy asserts.
 *
 * Orthogonal to open soft-fail char `#1027` (`q-mp-570-*`); this suite stays on
 * happy-path SVG / drag / slot gate pins. L18 `stylesInjected false→true`
 * remains the wave-8 / wave-19 hold under isolate:false.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  renderCard,
  renderCardSVG,
  renderSlot,
} from '../../src/core/expressions/expression-ui';
import { createNumberCard, createSlot } from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('mutation-ui20 expression-ui', () => {
  it('renderCardSVG defaults width 40 height 56 and centers text (kills L305–L335)', () => {
    const g = renderCardSVG(createNumberCard(7, 'n7'), 0, 0);
    const rect = g.querySelector('rect');
    const text = g.querySelector('text');
    expect(rect).toBeTruthy();
    expect(text).toBeTruthy();
    expect(rect!.getAttribute('width')).toBe('40');
    expect(rect!.getAttribute('height')).toBe('56');
    expect(text!.getAttribute('x')).toBe('20');
    expect(text!.getAttribute('y')).toBe('34');

    const custom = renderCardSVG(createNumberCard(1, 'n1'), 0, 0, {
      width: 60,
      height: 80,
    });
    const t2 = custom.querySelector('text');
    expect(t2!.getAttribute('x')).toBe('30');
    expect(t2!.getAttribute('y')).toBe('46');
  });

  it('renderCard draggable true attaches drag handlers (kills L274 true→false)', () => {
    const el = renderCard(createNumberCard(3, 'n3'), { draggable: true });
    expect(el.draggable).toBe(true);
    const dragStart = new Event('dragstart', {
      bubbles: true,
      cancelable: true,
    });
    const dt = {
      setData: vi.fn(),
      getData: vi.fn(),
      clearData: vi.fn(),
      dropEffect: 'none',
      effectAllowed: 'all',
      files: {} as FileList,
      items: {} as DataTransferItemList,
      types: [] as string[],
    };
    Object.defineProperty(dragStart, 'dataTransfer', { value: dt });
    el.dispatchEvent(dragStart);
    expect(el.classList.contains('dragging')).toBe(true);
    expect(dt.setData).toHaveBeenCalledWith('text/plain', 'n3');
  });

  it('slot onDrop registers only when unlocked (kills L389 && / !)', () => {
    const onDrop = vi.fn();
    const open = renderSlot(createSlot(0), { onDrop });
    expect(open.classList.contains('locked')).toBe(false);
    const over = new Event('dragover', { bubbles: true, cancelable: true });
    open.dispatchEvent(over);
    expect(open.classList.contains('highlight')).toBe(true);

    const lockedSlot = createSlot(1);
    lockedSlot.locked = true;
    const locked = renderSlot(lockedSlot, { onDrop });
    locked.dispatchEvent(
      new Event('dragover', { bubbles: true, cancelable: true })
    );
    expect(locked.classList.contains('highlight')).toBe(false);
  });

  it('empty slot onClick registers only when no card (kills L409 && / !)', () => {
    const onClick = vi.fn();
    const empty = renderSlot(createSlot(2), { onClick });
    empty.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    const filled = createSlot(3);
    filled.card = createNumberCard(9, 'n9');
    const withCard = renderSlot(filled, { onClick });
    withCard.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.skip('stylesInjected false→true (L18) — wave-8 / wave-19 / wave-20 hold under isolate:false', () => {
    // setup.ts clears head styles between tests while the module flag stays
    // true; DOM style-count asserts flake. See docs/dev/mutation-audit-ui-20.md.
  });
});
