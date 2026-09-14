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

describe('Wave 54 attr — set diamond points', () => {
  it('uses default-size diamond points 50,40 80,55 50,70 20,55', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'diamond',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(svg.querySelector('polygon')?.getAttribute('points')).toBe(
      '50,40 80,55 50,70 20,55'
    );
  });
});
