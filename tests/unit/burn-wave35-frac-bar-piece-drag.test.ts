/**
 * Wave 35 — createFractionBarPiece drag/dataAttr leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createFractionBarPiece } from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-piece — metadata + render styles', () => {
  it.each([
    ['p1', 1, 2, 'horizontal'],
    ['p2', 2, 3, 'vertical'],
    ['p3', 3, 4, 'circle'],
  ] as const)(
    'piece %s (%i/%i) style %s stamps attrs and embeds svg',
    (id, n, d, style) => {
      const piece = createFractionBarPiece(
        {
          id,
          fraction: { numerator: n, denominator: d },
          color: FRACTION_COLORS[d] || '#607d8b',
        },
        { style, showLabel: false, width: 60, height: 40 }
      );
      expect(piece.className).toBe('fraction-bar-piece');
      expect(piece.getAttribute('data-piece-id')).toBe(id);
      expect(piece.getAttribute('data-fraction')).toBe(`${n}/${d}`);
      expect(piece.getAttribute('draggable')).toBe('true');
      expect(piece.style.cursor).toBe('grab');
      expect(piece.querySelector('svg')).toBeTruthy();
    }
  );

  it('dragstart sets opacity and transfers piece id; dragend restores', () => {
    const setData = vi.fn();
    const piece = createFractionBarPiece({
      id: 'drag-me',
      fraction: { numerator: 1, denominator: 8 },
      color: '#00bcd4',
    });
    document.body.appendChild(piece);

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

  it('piece color overrides filled config when rendering bar', () => {
    const piece = createFractionBarPiece(
      {
        id: 'c',
        fraction: { numerator: 1, denominator: 2 },
        color: '#ff00aa',
      },
      { showLabel: false, style: 'horizontal' }
    );
    const fill = [...piece.querySelectorAll('rect')][1];
    expect(fill?.getAttribute('fill')).toBe('#ff00aa');
  });

  it('dragstart without dataTransfer still dims opacity', () => {
    const piece = createFractionBarPiece({
      id: 'nd',
      fraction: { numerator: 1, denominator: 4 },
      color: '#123456',
    });
    const start = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(start, 'dataTransfer', { value: null });
    piece.dispatchEvent(start);
    expect(piece.style.opacity).toBe('0.5');
  });
});
