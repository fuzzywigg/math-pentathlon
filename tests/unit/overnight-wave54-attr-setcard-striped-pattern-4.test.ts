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

describe('Wave 54 attr — set striped pattern', () => {
  it('inserts 4×4 userSpaceOnUse pattern as first child defs', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'striped',
        color: 'red',
      })
    );
    expect(svg.firstElementChild?.tagName.toLowerCase()).toBe('defs');
    const pattern = svg.querySelector('pattern');
    expect(pattern?.getAttribute('patternUnits')).toBe('userSpaceOnUse');
    expect(pattern?.getAttribute('width')).toBe('4');
    expect(pattern?.getAttribute('height')).toBe('4');
    const line = pattern?.querySelector('line');
    expect(line?.getAttribute('x1')).toBe('0');
    expect(line?.getAttribute('y2')).toBe('4');
    expect(line?.getAttribute('stroke-width')).toBe('2');
    expect(svg.querySelector('ellipse')?.getAttribute('fill')).toMatch(
      /^url\(#/
    );
  });
});
