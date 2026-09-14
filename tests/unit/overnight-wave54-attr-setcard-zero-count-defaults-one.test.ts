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

describe('Wave 54 attr — set count falsy', () => {
  it('treats number 0 as one shape via || 1', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 0,
        shape: 'oval',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(svg.querySelectorAll('ellipse')).toHaveLength(1);
  });
});
