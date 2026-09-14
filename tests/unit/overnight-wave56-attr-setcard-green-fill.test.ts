/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr setcard green fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderSetCard } from '../../src/core/attributes/attribute-ui';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — setcard green fill', () => {
  it('solid green oval fill #4caf50 leftover', () => {
    const svg = renderSetCard(
      createPiece('g', { number: 1, shape: 'oval', shading: 'solid', color: 'green' })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('#4caf50');
  });
});
