/**
 * Overnight TOKENMAXX — HexLayout.spacing optional field; createLayout omits it.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { createLayout, type HexLayout } from '../../src/core/hex/types';
import { axialToPixel } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — layout spacing field', () => {
  it('createLayout does not set spacing', () => {
    const d = createLayout();
    expect(d.spacing).toBeUndefined();
    expect(d.orientation).toBe('pointy');
    expect(d.size).toBe(30);
    expect(d.origin).toEqual({ x: 0, y: 0 });
  });

  it('spacing on layout is ignored by axialToPixel (position unchanged)', () => {
    const base: HexLayout = {
      orientation: 'flat',
      size: 20,
      origin: { x: 5, y: 5 },
    };
    const spaced: HexLayout = { ...base, spacing: 99 };
    const a = createAxial(2, -1);
    expect(axialToPixel(a, spaced)).toEqual(axialToPixel(a, base));
  });
});
