/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in coord-map.ts (scale guards).
 */
import { describe, expect, it } from 'vitest';
import {
  clientToNdc,
  clientToSvgUser,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';

describe('mutation-ui coord-map', () => {
  it('clientToSvgUser falls back to scale 1 when viewBoxWidth is 0', () => {
    // Survivors: viewBoxWidth > 0 && rect.width > 0 guards.
    const p = clientToSvgUser(
      10,
      20,
      { left: 0, top: 0, width: 100, height: 100 },
      0,
      0
    );
    expect(p).toEqual({ x: 10, y: 20 });
  });

  it('clientToSvgUser falls back to scale 1 when rect.width is 0', () => {
    const p = clientToSvgUser(
      5,
      7,
      { left: 0, top: 0, width: 0, height: 0 },
      100,
      100
    );
    expect(p).toEqual({ x: 5, y: 7 });
  });

  it('clientToSvgUser uses independent X/Y scales', () => {
    // Non-uniform CSS vs viewBox — kills && → || and boundary flips on either axis.
    const p = clientToSvgUser(
      50,
      25,
      { left: 0, top: 0, width: 100, height: 50 },
      200,
      100
    );
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(50);
  });

  it('boundary exactly at zero width/height viewBox uses fallback', () => {
    const p = clientToSvgUser(
      3,
      4,
      { left: 1, top: 2, width: 0, height: 10 },
      10,
      10
    );
    // width 0 → scaleX = 1; height ok → scaleY = 10/10 = 1
    expect(p).toEqual({ x: 2, y: 2 });
  });

  it('svgUserToGridCell rejects non-positive cellSize', () => {
    expect(svgUserToGridCell(10, 10, 0, 0)).toBeNull();
    expect(svgUserToGridCell(10, 10, -5, 0)).toBeNull();
  });

  it('clientToNdc null only when width OR height is exactly 0', () => {
    expect(
      clientToNdc(0, 0, { left: 0, top: 0, width: 0, height: 10 })
    ).toBeNull();
    expect(
      clientToNdc(0, 0, { left: 0, top: 0, width: 10, height: 0 })
    ).toBeNull();
    expect(
      clientToNdc(5, 5, { left: 0, top: 0, width: 10, height: 10 })
    ).toEqual({ x: 0, y: 0 });
  });

  it('resolveCanvas2dPixelRatio treats non-finite dpr as 1 and non-positive cap as default', () => {
    expect(resolveCanvas2dPixelRatio(Number.NaN)).toBe(1);
    expect(resolveCanvas2dPixelRatio(2, 0)).toBe(2);
    expect(resolveCanvas2dPixelRatio(2, -1)).toBe(2);
  });
});
