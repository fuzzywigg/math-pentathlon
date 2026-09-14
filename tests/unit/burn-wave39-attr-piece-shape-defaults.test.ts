/**
 * Wave 39 — attribute piece shape defaults / empty defs / circle+square.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderAttributePiece } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 39 attr — shape defaults', () => {
  const piece = createPiece('s1', {
    shape: 'square',
    color: 'green',
    size: 'medium',
  });

  it('unknown/custom shape falls back to card rect', () => {
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'custom',
      showLabels: false,
      pieceSize: 48,
    });
    expect(svg.querySelector('rect')).toBeTruthy();
    expect(svg.querySelector('circle')).toBeNull();
  });

  it('circle shape paints circle; square paints rect', () => {
    const circle = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'circle',
      showLabels: false,
    });
    expect(circle.querySelector('circle')).toBeTruthy();

    const square = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'square',
      showLabels: false,
      pieceSize: 50,
    });
    expect(square.querySelector('rect')).toBeTruthy();
    expect(square.getAttribute('height')).toBe('50');
  });

  it('empty definitions keep gray fallback fill', () => {
    const svg = renderAttributePiece(piece, [], {
      shape: 'card',
      showLabels: false,
    });
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
  });
});
