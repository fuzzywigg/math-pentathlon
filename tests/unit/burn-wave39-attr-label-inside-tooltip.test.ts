/**
 * Wave 39 — labelPosition inside/tooltip vs below height leftovers (attr-ui).
 * Deepens wave 29; attributes skipped in 35–38. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderAttributePiece } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 39 attr — labelPosition matrix', () => {
  const piece = createPiece('p1', {
    shape: 'circle',
    color: 'red',
    size: 'small',
  });

  it('below bumps height; inside/tooltip do not', () => {
    const below = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      pieceSize: 64,
      showLabels: true,
      labelPosition: 'below',
    });
    expect(below.getAttribute('height')).toBe('84');

    for (const labelPosition of ['inside', 'tooltip'] as const) {
      const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
        pieceSize: 64,
        showLabels: true,
        labelPosition,
      });
      expect(svg.getAttribute('height')).toBe('64');
    }
  });

  it('showLabels false with below still omits height bump', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      pieceSize: 40,
      showLabels: false,
      labelPosition: 'below',
    });
    expect(svg.getAttribute('height')).toBe('40');
  });
});
