/**
 * Wave 35 — fraction bar piece data attrs, dragstart/end, config style passthrough.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createFractionBarPiece } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-piece-drag', () => {
  it('stamps id/fraction and embeds styled svg', () => {
    const piece = createFractionBarPiece(
      {
        id: 'p-vert',
        fraction: { numerator: 2, denominator: 5 },
        color: '#ff00aa',
      },
      { style: 'vertical', showLabel: false, width: 30, height: 60 }
    );
    expect(piece.getAttribute('data-piece-id')).toBe('p-vert');
    expect(piece.getAttribute('data-fraction')).toBe('2/5');
    expect(piece.getAttribute('draggable')).toBe('true');
    const svg = piece.querySelector('svg');
    expect(svg?.classList.contains('fraction-bar-vertical')).toBe(true);
    const fill = svg?.querySelectorAll('rect')[1];
    expect(fill?.getAttribute('fill')).toBe('#ff00aa');
  });

  it('circle style piece embeds circle svg', () => {
    const piece = createFractionBarPiece({
      id: 'c1',
      fraction: { numerator: 1, denominator: 2 },
      color: '#123456',
    }, { style: 'circle', showLabel: false, width: 40, height: 40 });
    expect(
      piece.querySelector('svg')?.classList.contains('fraction-bar-circle')
    ).toBe(true);
  });

  it('dragstart sets opacity and dataTransfer id; dragend restores', () => {
    const setData = vi.fn();
    const piece = createFractionBarPiece({
      id: 'drag-me',
      fraction: { numerator: 1, denominator: 3 },
      color: '#000',
    });
    const start = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(start, 'dataTransfer', {
      value: { setData },
    });
    piece.dispatchEvent(start);
    expect(piece.style.opacity).toBe('0.5');
    expect(setData).toHaveBeenCalledWith('text/plain', 'drag-me');

    piece.dispatchEvent(new Event('dragend'));
    expect(piece.style.opacity).toBe('1');
  });

  it('dragstart without dataTransfer still dims opacity', () => {
    const piece = createFractionBarPiece({
      id: 'no-dt',
      fraction: { numerator: 1, denominator: 4 },
      color: '#222',
    });
    const start = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(start, 'dataTransfer', { value: null });
    piece.dispatchEvent(start);
    expect(piece.style.opacity).toBe('0.5');
  });
});

