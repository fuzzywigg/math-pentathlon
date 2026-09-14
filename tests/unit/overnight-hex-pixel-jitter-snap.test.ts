/**
 * Overnight TOKENMAXX — hex pixel jitter still snaps leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { axialToPixel, pixelToAxial, hexEquals } from '../../src/core/hex/coordinates';
import { createAxial, HexLayout } from '../../src/core/hex/types';

describe('Overnight hex — pixel jitter snap', () => {
  it('small jitter around cell center still rounds back', () => {
    const layout: HexLayout = { orientation: 'pointy', size: 30, origin: { x: 0, y: 0 } };
    const a = createAxial(2, -1);
    const px = axialToPixel(a, layout);
    for (const [dx, dy] of [[1, 0], [0, 1], [-2, 1], [3, -2]]) {
      expect(hexEquals(pixelToAxial({ x: px.x + dx, y: px.y + dy }, layout), a)).toBe(true);
    }
  });
});
