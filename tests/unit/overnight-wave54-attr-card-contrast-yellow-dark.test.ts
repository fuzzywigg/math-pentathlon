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

describe('Wave 54 attr — yellow contrast', () => {
  it('fills BASIC yellow card #ffeb3b with dark primary text', () => {
    const svg = renderAttributePiece(
      createPiece('y', { shape: 'square', color: 'yellow', size: 'large' }),
      BASIC_ATTRIBUTES,
      { shape: 'card', showLabels: false }
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#ffeb3b');
    expect(svg.querySelector('text')?.getAttribute('fill')).toBe('#333');
  });
});
