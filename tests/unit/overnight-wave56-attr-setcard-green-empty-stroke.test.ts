/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr setcard green empty stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderSetCard } from '../../src/core/attributes/attribute-ui';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — setcard green empty stroke', () => {
  it('empty green oval fill none + stroke leftover', () => {
    const svg = renderSetCard(
      createPiece('e', { number: 1, shape: 'oval', shading: 'empty', color: 'green' })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('none');
    expect(oval?.getAttribute('stroke')).toBe('#4caf50');
  });
});
