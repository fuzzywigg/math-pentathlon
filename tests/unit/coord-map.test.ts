import { describe, it, expect } from 'vitest';
import {
  CANVAS_2D_PIXEL_RATIO_CAP,
  clientToNdc,
  clientToSvgUser,
  configureCanvas2dBackingStore,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';

describe('coord-map — SVG scale-aware mapping', () => {
  it('clientToSvgUser is identity when CSS size matches viewBox', () => {
    const p = clientToSvgUser(
      30,
      50,
      { left: 10, top: 20, width: 100, height: 100 },
      100,
      100
    );
    expect(p).toEqual({ x: 20, y: 30 });
  });

  it('clientToSvgUser accounts for CSS shrink (viewBox larger than rect)', () => {
    // viewBox 200×200 drawn into 100×100 CSS → scale 0.5
    const p = clientToSvgUser(
      60,
      40,
      { left: 0, top: 0, width: 100, height: 100 },
      200,
      200
    );
    expect(p).toEqual({ x: 120, y: 80 });
  });

  it('svgUserToGridCell maps padding + cellSize; OOB padding is null', () => {
    expect(svgUserToGridCell(4 + 40 + 1, 4 + 20 + 1, 20, 4)).toEqual({
      row: 1,
      col: 2,
    });
    expect(svgUserToGridCell(2, 2, 20, 4)).toBeNull();
  });

  it('scaled CSS click lands on the same cell as 1:1', () => {
    const cellSize = 20;
    const padding = 4;
    const viewBox = 3 * cellSize + padding * 2; // 68
    // Cell (1,2) center in user units
    const userX = padding + 2 * cellSize + cellSize / 2;
    const userY = padding + 1 * cellSize + cellSize / 2;

    const unscaled = svgUserToGridCell(userX, userY, cellSize, padding);
    const cssScale = 0.5;
    const rect = {
      left: 0,
      top: 0,
      width: viewBox * cssScale,
      height: viewBox * cssScale,
    };
    const { x, y } = clientToSvgUser(
      userX * cssScale,
      userY * cssScale,
      rect,
      viewBox,
      viewBox
    );
    expect(svgUserToGridCell(x, y, cellSize, padding)).toEqual(unscaled);
  });
});

describe('coord-map — NDC + canvas DPR', () => {
  it('clientToNdc maps corners and center; empty rect is null', () => {
    const rect = { left: 10, top: 20, width: 200, height: 100 };
    expect(clientToNdc(10, 20, rect)).toEqual({ x: -1, y: 1 });
    expect(clientToNdc(210, 120, rect)).toEqual({ x: 1, y: -1 });
    expect(clientToNdc(110, 70, rect)).toEqual({ x: 0, y: 0 });
    expect(
      clientToNdc(0, 0, { left: 0, top: 0, width: 0, height: 0 })
    ).toBeNull();
  });

  it('resolveCanvas2dPixelRatio caps at 2 and floors tiny/invalid', () => {
    expect(CANVAS_2D_PIXEL_RATIO_CAP).toBe(2);
    expect(resolveCanvas2dPixelRatio(1)).toBe(1);
    expect(resolveCanvas2dPixelRatio(2)).toBe(2);
    expect(resolveCanvas2dPixelRatio(3)).toBe(2);
    expect(resolveCanvas2dPixelRatio(3, 1.5)).toBe(1.5);
  });

  it('configureCanvas2dBackingStore sets CSS size and scaled buffer', () => {
    const canvas = document.createElement('canvas');
    const dpr = configureCanvas2dBackingStore(canvas, 40, 20, { dpr: 3 });
    expect(dpr).toBe(2);
    expect(canvas.width).toBe(80);
    expect(canvas.height).toBe(40);
    expect(canvas.style.width).toBe('40px');
    expect(canvas.style.height).toBe('20px');
  });
});
