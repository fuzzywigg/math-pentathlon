/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr piece-wrapper radius/transition leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createPieceGrid } from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

describe('Wave 56 attr — grid wrapper radius', () => {
  it('wrapper border-radius 8px + transition leftover', () => {
    const el = createPieceGrid(
      [createPiece('a', { shape: 'square', color: 'red' })],
      BASIC_ATTRIBUTES,
      () => undefined
    );
    const wrap = el.querySelector('.piece-wrapper') as HTMLElement;
    expect(wrap.style.borderRadius).toBe('8px');
    expect(wrap.style.transition).toBe('all 0.2s');
  });
});
