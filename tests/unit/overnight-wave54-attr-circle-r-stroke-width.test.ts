/**
 * Overnight HEAVY leftover after #239 — core/attributes exact chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
  injectAttributeStyles,
} from '../../src/core/attributes/attribute-ui';
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

describe('Wave 54 attr — circle geometry', () => {
  it('uses r=36 stroke-width 3 and BASIC shape stroke #2196f3', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'circle',
      showLabels: false,
    });
    const c = svg.querySelector('circle');
    expect(c?.getAttribute('cx')).toBe('40');
    expect(c?.getAttribute('cy')).toBe('40');
    expect(c?.getAttribute('r')).toBe('36');
    expect(c?.getAttribute('stroke-width')).toBe('3');
    expect(c?.getAttribute('stroke')).toBe('#2196f3');
    expect(c?.getAttribute('fill')).toBe('#f44336');
  });
});
