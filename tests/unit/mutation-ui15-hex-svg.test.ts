/**
 * q-mp-457 mutation audit UI wave 15 — structural re-pins for hex-svg
 * (wave-2 already 100% first-20; tip remeasure still saturated).
 * Numeric / path-shape asserts only; no player-facing copy.
 */
import { describe, expect, it } from 'vitest';
import {
  flatTopAxialToPixel,
  pointyTopHexCorners,
  pointyTopHexPathD,
  pointyTopHexPolygonPoints,
} from '../../src/ui/hex-svg';

describe('mutation-ui15 hex-svg', () => {
  it('corner loop stays exclusive < 6 (kills L20 <→<= / 6→5/7 / 0→1)', () => {
    const corners = pointyTopHexCorners(0, 0, 10);
    expect(corners).toHaveLength(6);
    // First vertex at -30°: (√3/2 * size, -size/2)
    expect(corners[0]!.x).toBeCloseTo(10 * (Math.sqrt(3) / 2), 10);
    expect(corners[0]!.y).toBeCloseTo(-5, 10);
    // i=2 → 90° → (0, size)
    expect(corners[2]!.x).toBeCloseTo(0, 10);
    expect(corners[2]!.y).toBeCloseTo(10, 10);
  });

  it('angle uses (π/3)*i − π/6 (kills L21 −→+ and *↔/ on 3 and 6)', () => {
    const size = 12;
    const c = pointyTopHexCorners(0, 0, size);
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      expect(c[i]!.x).toBeCloseTo(size * Math.cos(angle), 10);
      expect(c[i]!.y).toBeCloseTo(size * Math.sin(angle), 10);
    }
  });

  it('center offset uses + not − (kills L23/L24 +→−)', () => {
    const origin = pointyTopHexCorners(0, 0, 8);
    const shifted = pointyTopHexCorners(30, -12, 8);
    expect(shifted[4]!.x - origin[4]!.x).toBeCloseTo(30, 10);
    expect(shifted[4]!.y - origin[4]!.y).toBeCloseTo(-12, 10);
  });

  it('path d uses M only for i===0 then five L then Z', () => {
    const d = pointyTopHexPathD(3, 4, 7);
    expect(d.startsWith('M ')).toBe(true);
    expect((d.match(/ L /g) ?? []).length).toBe(5);
    expect(d.endsWith(' Z')).toBe(true);
    const pts = pointyTopHexPolygonPoints(3, 4, 7);
    expect(pts.split(' ')).toHaveLength(6);
  });

  it('flat-top axial uses size*(3/2)*q (kills L67 *→/)', () => {
    expect(flatTopAxialToPixel(4, 0, 10).x).toBeCloseTo(60, 10);
    expect(flatTopAxialToPixel(0, 3, 10).x).toBeCloseTo(0, 10);
    expect(flatTopAxialToPixel(0, 3, 10).y).toBeCloseTo(
      10 * Math.sqrt(3) * 3,
      10
    );
    expect(flatTopAxialToPixel(2, -1, 8).y).toBeCloseTo(
      8 * ((Math.sqrt(3) / 2) * 2 + Math.sqrt(3) * -1),
      10
    );
  });
});
