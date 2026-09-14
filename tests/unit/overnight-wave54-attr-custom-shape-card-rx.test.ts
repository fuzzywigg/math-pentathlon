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

describe('Wave 54 attr — custom shape rx', () => {
  it('falls through custom shape to card rect with rx=8', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'custom',
      showLabels: false,
      pieceSize: 80,
    });
    expect(svg.querySelector('rect')?.getAttribute('rx')).toBe('8');
    expect(svg.querySelector('circle')).toBeNull();
  });
});
