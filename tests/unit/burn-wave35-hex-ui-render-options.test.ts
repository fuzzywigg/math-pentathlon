/**
 * Wave 35 — renderHex options / events leftover matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { renderHex, type HexLayout } from '../../src/core/hex';

const pointy: HexLayout = {
  orientation: 'pointy',
  size: 18,
  origin: { x: 40, y: 40 },
};

const flat: HexLayout = {
  orientation: 'flat',
  size: 14,
  origin: { x: 20, y: 20 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 hex-ui-render — defaults + overrides', () => {
  it('defaults: fill #e0e0e0, stroke #999, stroke-width 1', () => {
    const g = renderHex({ q: 0, r: 0 }, pointy);
    expect(g.classList.contains('hex-cell')).toBe(true);
    expect(g.dataset.coord).toBe('0,0');
    const path = g.querySelector('path')!;
    expect(path.getAttribute('fill')).toBe('#e0e0e0');
    expect(path.getAttribute('stroke')).toBe('#999');
    expect(path.getAttribute('stroke-width')).toBe('1');
    expect(g.querySelector('.hex-label')).toBeNull();
  });

  it('applies className, strokeWidth, label colors/size', () => {
    const g = renderHex({ q: -1, r: 2 }, flat, {
      fill: '#abcabc',
      stroke: '#010101',
      strokeWidth: 2.5,
      label: 'X',
      labelColor: '#ff0',
      labelSize: 16,
      className: 'selected highlighted',
    });
    expect(g.classList.contains('selected')).toBe(true);
    expect(g.classList.contains('highlighted')).toBe(true);
    expect(g.dataset.coord).toBe('-1,2');
    expect(g.querySelector('path')?.getAttribute('stroke-width')).toBe('2.5');
    const label = g.querySelector('.hex-label')!;
    expect(label.textContent).toBe('X');
    expect(label.getAttribute('fill')).toBe('#ff0');
    expect(label.getAttribute('font-size')).toBe('16');
  });

  it('without onClick, cursor stays default', () => {
    const g = renderHex({ q: 1, r: 0 }, pointy, { fill: '#fff' });
    expect(g.style.cursor).toBe('');
  });

  it('onClick sets pointer cursor and fires with coord', () => {
    const seen: Array<[number, number]> = [];
    const g = renderHex({ q: 3, r: -2 }, flat, {
      onClick: (c) => seen.push([c.q, c.r]),
    });
    expect(g.style.cursor).toBe('pointer');
    g.dispatchEvent(new Event('click'));
    g.dispatchEvent(new Event('click'));
    expect(seen).toEqual([
      [3, -2],
      [3, -2],
    ]);
  });

  it('onHover enter/leave without onClick', () => {
    const events: boolean[] = [];
    const g = renderHex({ q: 0, r: 1 }, pointy, {
      onHover: (_c, entering) => events.push(entering),
    });
    g.dispatchEvent(new Event('mouseenter'));
    g.dispatchEvent(new Event('mouseleave'));
    expect(events).toEqual([true, false]);
  });

  it('flat layout path differs from pointy for same coord', () => {
    const a = renderHex({ q: 1, r: 1 }, pointy).querySelector('path')!;
    const b = renderHex({ q: 1, r: 1 }, flat).querySelector('path')!;
    expect(a.getAttribute('d')).not.toBe(b.getAttribute('d'));
  });
});
