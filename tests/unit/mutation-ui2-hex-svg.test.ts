import { describe, expect, it } from 'vitest';
import {
  flatTopAxialToPixel,
  pointyTopHexCorners,
  pointyTopHexPathD,
  pointyTopHexPolygonPoints,
} from '../../src/ui/hex-svg';

describe('mutation-ui2 hex-svg geometry', () => {
  it('emits exactly 6 pointy-top corners with -30° first vertex', () => {
    const size = 10;
    const corners = pointyTopHexCorners(0, 0, size);
    expect(corners).toHaveLength(6);
    // i=0 → angle -π/6 → (size*√3/2, -size/2)
    expect(corners[0]!.x).toBeCloseTo(size * (Math.sqrt(3) / 2), 10);
    expect(corners[0]!.y).toBeCloseTo(-size / 2, 10);
    // i=1 → angle π/6 → (size*√3/2, size/2)
    expect(corners[1]!.x).toBeCloseTo(size * (Math.sqrt(3) / 2), 10);
    expect(corners[1]!.y).toBeCloseTo(size / 2, 10);
    // Opposite corner i=3
    expect(corners[3]!.x).toBeCloseTo(-size * (Math.sqrt(3) / 2), 10);
    expect(corners[3]!.y).toBeCloseTo(size / 2, 10);
  });

  it('offsets corners by center and scales by size', () => {
    const a = pointyTopHexCorners(100, 50, 20);
    const b = pointyTopHexCorners(0, 0, 20);
    expect(a[0]!.x - b[0]!.x).toBeCloseTo(100, 10);
    expect(a[0]!.y - b[0]!.y).toBeCloseTo(50, 10);
    const half = pointyTopHexCorners(0, 0, 10);
    expect(a[2]!.x - 100).toBeCloseTo(2 * half[2]!.x, 10);
  });

  it('polygon points list matches corner count (6 pairs)', () => {
    const pts = pointyTopHexPolygonPoints(0, 0, 8);
    const pairs = pts.split(' ');
    expect(pairs).toHaveLength(6);
    for (const p of pairs) {
      const [xs, ys] = p.split(',');
      expect(Number.isFinite(Number(xs))).toBe(true);
      expect(Number.isFinite(Number(ys))).toBe(true);
    }
  });

  it('path d starts with M, has 5 L segments, ends with Z', () => {
    const d = pointyTopHexPathD(1, 2, 5);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    expect((d.match(/ L /g) ?? []).length).toBe(5);
    expect((d.match(/ M /g) ?? []).length).toBe(0);
  });

  it('flat-top axial→pixel uses 3/2 q and √3 terms', () => {
    const p = flatTopAxialToPixel(2, 1, 10);
    expect(p.x).toBeCloseTo(10 * (3 / 2) * 2, 10);
    expect(p.y).toBeCloseTo(
      10 * ((Math.sqrt(3) / 2) * 2 + Math.sqrt(3) * 1),
      10
    );
    const origin = flatTopAxialToPixel(0, 0, 10);
    expect(origin).toEqual({ x: 0, y: 0 });
  });
});
