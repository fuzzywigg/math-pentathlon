/**
 * Wave 40 — attr-ui grid columns/click + empty defs + inject leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderAttributePiece,
  createPieceGrid,
  injectAttributeStyles,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  createPiece,
} from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('attribute-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 40 attr-ui — grid + inject', () => {
  it('empty pieces / empty defs still mount without throwing', () => {
    const emptyGrid = createPieceGrid([], BASIC_ATTRIBUTES, () => undefined);
    expect(emptyGrid.className).toBe('piece-grid');
    expect(emptyGrid.querySelectorAll('.piece-wrapper')).toHaveLength(0);

    const piece = createPiece('p', { shape: 'circle', color: 'red', size: 'small' });
    const svg = renderAttributePiece(piece, [], {
      showLabels: false,
      shape: 'card',
    });
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
    expect(svg.querySelector('text')).toBeNull();
  });

  it('grid click selects piece; selectedIds paints border', () => {
    const pieces = [
      createPiece('a', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('b', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const picked: string[] = [];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      (p) => picked.push(p.id),
      new Set(['b']),
      { showLabels: false, pieceSize: 40 }
    );
    const wrappers = [
      ...grid.querySelectorAll('.piece-wrapper'),
    ] as HTMLElement[];
    expect(wrappers).toHaveLength(2);
    expect(wrappers[1].classList.contains('selected')).toBe(true);
    expect(wrappers[1].style.borderColor.toLowerCase()).toMatch(/2196f3|rgb\(33,\s*150,\s*243\)/);
    wrappers[0].click();
    expect(picked).toEqual(['a']);
  });

  it('grid columns wrap via flex; mouseleave restores transparent border', () => {
    const pieces = Array.from({ length: 6 }, (_, i) =>
      createPiece(`p${i}`, {
        shape: 'circle',
        color: 'red',
        size: 'small',
      })
    );
    const grid = createPieceGrid(pieces, BASIC_ATTRIBUTES, () => undefined);
    expect(grid.className).toBe('piece-grid');
    expect(grid.querySelectorAll('.piece-wrapper')).toHaveLength(6);
    const first = grid.querySelector('.piece-wrapper') as HTMLElement;
    first.dispatchEvent(new Event('mouseenter'));
    expect(first.style.borderColor.replace(/\s/g, '')).toMatch(
      /#90caf9|rgb\(144,202,249\)/i
    );
    first.dispatchEvent(new Event('mouseleave'));
    expect(first.style.borderColor).toBe('transparent');
  });

  it('injectAttributeStyles is idempotent', () => {
    injectAttributeStyles();
    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
    expect(document.getElementById('attribute-styles')?.textContent).toContain(
      '.piece-grid'
    );
  });

  it('unknown color attribute leaves default bg when not in colorMap', () => {
    const defs = [
      {
        name: 'color',
        possibleValues: ['red'],
        colorMap: { red: '#f00' },
      },
    ];
    const svg = renderAttributePiece(
      createPiece('x', { color: 'chartreuse' }),
      defs,
      { showLabels: false, shape: 'circle' }
    );
    // no mapped color → default bg
    expect(svg.querySelector('circle')?.getAttribute('fill')).toBe('#e0e0e0');
  });
});
