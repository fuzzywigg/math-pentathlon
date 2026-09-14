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

describe('Wave 54 attr — card rect chrome', () => {
  it('paints inset card rect with rx=8 stroke #333 width 2', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'card',
      showLabels: false,
    });
    const rect = svg.querySelector('rect');
    expect(rect?.getAttribute('x')).toBe('2');
    expect(rect?.getAttribute('y')).toBe('2');
    expect(rect?.getAttribute('width')).toBe('76');
    expect(rect?.getAttribute('height')).toBe('76');
    expect(rect?.getAttribute('rx')).toBe('8');
    expect(rect?.getAttribute('stroke')).toBe('#333');
    expect(rect?.getAttribute('stroke-width')).toBe('2');
  });
});
