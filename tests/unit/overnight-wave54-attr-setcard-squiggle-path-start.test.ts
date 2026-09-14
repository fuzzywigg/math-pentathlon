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

describe('Wave 54 attr — set squiggle path', () => {
  it('starts squiggle path at M 20 55', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'squiggle',
        shading: 'empty',
        color: 'purple',
      })
    );
    const d = svg.querySelector('path')?.getAttribute('d') ?? '';
    expect(d.replace(/\s+/g, ' ').trim()).toMatch(/^M 20 55/);
  });
});
