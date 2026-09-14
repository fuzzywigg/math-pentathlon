/**
 * Overnight TOKENMAXX — hexPath closes with Z; corner count 6.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { hexPath, getHexCorners } from '../../src/core/hex/hex-ui';

describe('Overnight core hex-ui — path closed', () => {
  it('hexPath ends with Z and starts with M', () => {
    const center = { x: 12, y: -4 };
    const pointy = hexPath(center, 20, false);
    const flat = hexPath(center, 20, true);
    expect(pointy.startsWith('M ')).toBe(true);
    expect(pointy.endsWith(' Z')).toBe(true);
    expect(flat.endsWith(' Z')).toBe(true);
    expect(pointy).not.toBe(flat);
    expect(getHexCorners(center, 20, false)).toHaveLength(6);
  });
});
