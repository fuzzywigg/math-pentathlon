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

describe('Wave 54 attr — card viewBox', () => {
  it('uses viewBox 0 0 80 100 when labels sit below', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: true,
      labelPosition: 'below',
    });
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 100');
    expect(svg.getAttribute('width')).toBe('80');
    expect(svg.getAttribute('height')).toBe('100');
  });
});
