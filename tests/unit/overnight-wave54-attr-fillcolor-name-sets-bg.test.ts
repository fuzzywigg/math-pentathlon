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

describe('Wave 54 attr — fillcolor bg', () => {
  it('treats def names containing color as background fill', () => {
    const defs = [
      {
        name: 'fillcolor',
        possibleValues: ['red'],
        colorMap: { red: '#112233' },
      },
    ];
    const svg = renderAttributePiece(
      createPiece('fc', { fillcolor: 'red' }),
      defs,
      { shape: 'card', showLabels: false }
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#112233');
  });
});
