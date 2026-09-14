/**
 * Wave 44 — expr formatNumber × poly bounding box handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatNumber, evaluate } from '../../src/core/expressions';
import { TETROMINOES, getBoundingBox, getSymmetryCount } from '../../src/core/polyomino';

describe('Wave 44 handshake — expr × poly bounds', () => {
  it('I-tetromino width formats as integer string matching size', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const box = getBoundingBox(I.cells);
    expect(formatNumber(box.width)).toBe('4');
    expect(evaluate(`${box.width}*${box.height}`).value).toBe(4);
    expect(getSymmetryCount(I)).toBeLessThanOrEqual(4);
  });
});
