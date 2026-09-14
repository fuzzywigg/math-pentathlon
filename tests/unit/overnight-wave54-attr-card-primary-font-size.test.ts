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

describe('Wave 54 attr — card primary text', () => {
  it('centers primary text at size/3 with middle baseline', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
    });
    const text = svg.querySelector('text');
    expect(text?.getAttribute('x')).toBe('40');
    expect(text?.getAttribute('y')).toBe('40');
    expect(text?.getAttribute('text-anchor')).toBe('middle');
    expect(text?.getAttribute('dominant-baseline')).toBe('middle');
    expect(text?.getAttribute('font-size')).toBe('26.666666666666668');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.textContent).toBe('circle');
  });
});
