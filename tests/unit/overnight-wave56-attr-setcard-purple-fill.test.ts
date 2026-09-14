/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr setcard purple fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderSetCard } from '../../src/core/attributes/attribute-ui';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — setcard purple fill', () => {
  it('solid purple diamond fill #9c27b0 leftover', () => {
    const svg = renderSetCard(
      createPiece('p', { number: 1, shape: 'diamond', shading: 'solid', color: 'purple' })
    );
    const poly = svg.querySelector('polygon');
    expect(poly?.getAttribute('fill')).toBe('#9c27b0');
  });
});
