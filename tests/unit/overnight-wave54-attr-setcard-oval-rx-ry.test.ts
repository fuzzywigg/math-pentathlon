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

describe('Wave 54 attr — set oval geometry', () => {
  it('places one oval at cx=50 cy=55 rx=30 ry=15', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: 'red',
      })
    );
    const e = svg.querySelector('ellipse');
    expect(e?.getAttribute('cx')).toBe('50');
    expect(e?.getAttribute('cy')).toBe('55');
    expect(e?.getAttribute('rx')).toBe('30');
    expect(e?.getAttribute('ry')).toBe('15');
  });
});
