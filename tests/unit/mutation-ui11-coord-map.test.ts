/**
 * q-mp-350 mutation audit UI wave 11 — kill coord-map first-20 survivors.
 * Structural / numeric asserts only — no player-facing copy.
 */
import { describe, expect, it } from 'vitest';

import {
  CANVAS_2D_PIXEL_RATIO_CAP,
  clientToNdc,
  clientToSvgUser,
  configureCanvas2dBackingStore,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';

describe('mutation-ui11 coord-map', () => {
  it('viewBoxWidth=1 uses scale (kills L31 viewBoxWidth > 0 → > 1)', () => {
    // Survivor: NumericBoundary 0→1 on `viewBoxWidth > 0`.
    // At width=1, original scaleX = rect.width/1; mutant (>1) falls back to 1.
    const p = clientToSvgUser(
      50,
      0,
      { left: 0, top: 0, width: 100, height: 100 },
      1,
      100
    );
    expect(p.x).toBeCloseTo(0.5);
    expect(p.y).toBeCloseTo(0);
  });

  it('rect.width=1 uses scale (kills L31 rect.width > 0 → > 1)', () => {
    // Survivor: NumericBoundary 0→1 on `rect.width > 0`.
    // At CSS width=1, original scaleX = 1/100; mutant falls back to 1.
    const p = clientToSvgUser(
      1,
      0,
      { left: 0, top: 0, width: 1, height: 100 },
      100,
      100
    );
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(0);
  });

  it('viewBoxHeight=1 uses scale (kills L33 viewBoxHeight > 0 → > 1)', () => {
    const p = clientToSvgUser(
      0,
      50,
      { left: 0, top: 0, width: 100, height: 100 },
      100,
      1
    );
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0.5);
  });

  it('rect.height=1 uses scale (kills L33 rect.height > 0 → > 1)', () => {
    const p = clientToSvgUser(
      0,
      1,
      { left: 0, top: 0, width: 100, height: 1 },
      100,
      100
    );
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(100);
  });

  it('independent axis fallback when only one dimension is zero', () => {
    // Mixed: X falls back (viewBoxWidth 0), Y scales (height ok).
    const p = clientToSvgUser(
      10,
      20,
      { left: 0, top: 0, width: 50, height: 50 },
      0,
      100
    );
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(40);
  });

  it('svgUserToGridCell rejects cellSize exactly 0 and keeps positive path', () => {
    // cellSize <= 0; pin 0 boundary vs positive 1.
    expect(svgUserToGridCell(10, 10, 0, 0)).toBeNull();
    expect(svgUserToGridCell(10, 10, 1, 0)).toEqual({ row: 10, col: 10 });
  });

  it('clientToNdc treats width===0 and height===0 independently', () => {
    expect(
      clientToNdc(1, 1, { left: 0, top: 0, width: 0, height: 8 })
    ).toBeNull();
    expect(
      clientToNdc(1, 1, { left: 0, top: 0, width: 8, height: 0 })
    ).toBeNull();
    expect(clientToNdc(4, 2, { left: 0, top: 0, width: 8, height: 4 })).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('CANVAS_2D_PIXEL_RATIO_CAP is exactly 2; configure rounds via max(1,…)', () => {
    expect(CANVAS_2D_PIXEL_RATIO_CAP).toBe(2);
    expect(resolveCanvas2dPixelRatio(9)).toBe(2);
    const canvas = document.createElement('canvas');
    // cssWidth 0 → Math.max(1, round(0*dpr)) keeps backing ≥ 1.
    const dpr = configureCanvas2dBackingStore(canvas, 0, 10, { dpr: 1 });
    expect(dpr).toBe(1);
    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(10);
    expect(canvas.style.width).toBe('0px');
    expect(canvas.style.height).toBe('10px');
  });
});
