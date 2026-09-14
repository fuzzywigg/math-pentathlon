/**
 * Overnight HEAVY leftover after #239 — core/attributes exact chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createPieceGrid } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('attribute-styles')?.remove();
});

const piece = createPiece('p1', {
  shape: 'circle',
  color: 'red',
  size: 'small',
});

describe('Wave 54 attr — grid piece mount', () => {
  it('mounts attribute-piece with dataset.pieceId under piece-wrapper', () => {
    const grid = createPieceGrid(
      [piece],
      BASIC_ATTRIBUTES,
      () => undefined,
      new Set(),
      {
        showLabels: false,
      }
    );
    expect(grid.className).toBe('piece-grid');
    const wrapper = grid.querySelector('.piece-wrapper');
    const svg = wrapper?.querySelector(
      'svg.attribute-piece'
    ) as SVGSVGElement | null;
    expect(svg?.dataset.pieceId).toBe('p1');
    expect(wrapper?.contains(svg as Node)).toBe(true);
  });
});
