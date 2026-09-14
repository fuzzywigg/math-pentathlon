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

describe('Wave 54 attr — square inset', () => {
  it('paints square rect inset 4 with no rx', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'square',
      showLabels: false,
    });
    const rect = svg.querySelector('rect');
    expect(rect?.getAttribute('x')).toBe('4');
    expect(rect?.getAttribute('y')).toBe('4');
    expect(rect?.getAttribute('width')).toBe('72');
    expect(rect?.getAttribute('height')).toBe('72');
    expect(rect?.getAttribute('rx')).toBeNull();
    expect(rect?.getAttribute('stroke')).toBe('#333');
    expect(rect?.getAttribute('stroke-width')).toBe('2');
  });
});
