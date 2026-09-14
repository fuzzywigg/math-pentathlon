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

describe('Wave 54 attr — card label chrome', () => {
  it('places below-label at y=94 font-size 11 fill #666', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: true,
      labelPosition: 'below',
    });
    const label = svg.querySelectorAll('text')[1];
    expect(label?.getAttribute('y')).toBe('94');
    expect(label?.getAttribute('x')).toBe('40');
    expect(label?.getAttribute('font-size')).toBe('11');
    expect(label?.getAttribute('fill')).toBe('#666');
    expect(label?.getAttribute('text-anchor')).toBe('middle');
  });
});
