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

describe('Wave 54 attr — set card viewBox', () => {
  it('defaults to 100×140 viewBox 0 0 100 140', () => {
    const svg = renderSetCard(
      createPiece('s', {
        number: 1,
        shape: 'oval',
        shading: 'solid',
        color: 'red',
      })
    );
    expect(svg.getAttribute('width')).toBe('100');
    expect(svg.getAttribute('height')).toBe('140');
    expect(svg.getAttribute('viewBox')).toBe('0 0 100 140');
    expect(svg.classList.contains('set-card')).toBe(true);
  });
});
