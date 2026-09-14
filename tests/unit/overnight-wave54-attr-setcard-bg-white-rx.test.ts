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

describe('Wave 54 attr — set card bg', () => {
  it('paints white rounded bg rect 96×136 rx=8', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'empty',
        color: 'green',
      })
    );
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('x')).toBe('2');
    expect(bg?.getAttribute('y')).toBe('2');
    expect(bg?.getAttribute('width')).toBe('96');
    expect(bg?.getAttribute('height')).toBe('136');
    expect(bg?.getAttribute('rx')).toBe('8');
    expect(bg?.getAttribute('fill')).toBe('white');
    expect(bg?.getAttribute('stroke')).toBe('#333');
    expect(bg?.getAttribute('stroke-width')).toBe('2');
  });
});
