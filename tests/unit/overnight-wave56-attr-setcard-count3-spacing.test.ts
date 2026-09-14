/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr setcard count3 spacing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderSetCard } from '../../src/core/attributes/attribute-ui';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — setcard count3 spacing', () => {
  it('three ovals have distinct cy leftover', () => {
    const svg = renderSetCard(
      createPiece('3', { number: 3, shape: 'oval', shading: 'solid', color: 'red' })
    );
    const ellipses = [...svg.querySelectorAll('ellipse')];
    expect(ellipses).toHaveLength(3);
    const cys = ellipses.map((e) => Number(e.getAttribute('cy')));
    expect(new Set(cys).size).toBe(3);
    expect(cys[1]! - cys[0]!).toBe(40); // shapeHeight 30 + spacing 10
  });
});
