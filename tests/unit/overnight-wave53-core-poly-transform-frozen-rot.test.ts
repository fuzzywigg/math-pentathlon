/**
 * Overnight HEAVY leftover after #241 — getTransformedCells ignores rotation when
 * canRotate is false. Distinct from wave52 absolute-flip-flag diverge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getTransformedCells, TETROMINOES } from '../../src/core/polyomino';

describe('Wave 53 core poly — transform ignores frozen rotation', () => {
  it('O-tetromino 0 and 90 share cells; frozen I 90 matches 0', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(O.canRotate).toBe(false);
    expect(getTransformedCells(O, 0, false)).toEqual(
      getTransformedCells(O, 90, false)
    );

    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const frozen = { ...I, canRotate: false };
    expect(getTransformedCells(frozen, 90, false)).toEqual(
      getTransformedCells(frozen, 0, false)
    );
    expect(getTransformedCells(I, 90, false)).not.toEqual(
      getTransformedCells(I, 0, false)
    );
  });
});
