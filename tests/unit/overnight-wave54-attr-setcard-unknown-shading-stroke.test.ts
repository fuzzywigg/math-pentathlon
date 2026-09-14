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

describe('Wave 54 attr — unknown shading', () => {
  it('still stamps stroke-width 2 when shading is unrecognized', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'hatched',
        color: 'red',
      })
    );
    const e = svg.querySelector('ellipse');
    expect(e?.getAttribute('stroke-width')).toBe('2');
    expect(e?.getAttribute('fill')).toBeNull();
  });
});
