import { describe, it, expect, vi } from 'vitest';
import {
  createHexAGonePieceGeometries,
  disposeHexAGonePieceGeometries,
  geometryForShape,
  PIECE_HEIGHT,
} from '../../src/ui/three/hex-a-gone-pieces';
import type { BlockShape } from '../../src/games/hex-a-gone/types';

function fakeThree() {
  class Shape {
    moveTo() {
      return this;
    }
    lineTo() {
      return this;
    }
    closePath() {
      return this;
    }
  }
  class ExtrudeGeometry {
    dispose = vi.fn();
    constructor(
      public shape: unknown,
      public opts: { depth: number; bevelEnabled: boolean }
    ) {}
  }
  return { Shape, ExtrudeGeometry };
}

describe('mp3d Hex-a-Gone pattern-block pieces', () => {
  it('builds bevelled extrusions for every bank shape', () => {
    const THREE = fakeThree() as unknown as typeof import('three');
    const geos = createHexAGonePieceGeometries(THREE);
    const shapes: BlockShape[] = [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ];
    for (const shape of shapes) {
      const geo = geometryForShape(geos, shape) as {
        opts: { depth: number; bevelEnabled: boolean };
        dispose: ReturnType<typeof vi.fn>;
      };
      expect(geo.opts.depth).toBe(PIECE_HEIGHT);
      expect(geo.opts.bevelEnabled).toBe(true);
    }
    disposeHexAGonePieceGeometries(geos);
    expect(
      (geos.hexagon as { dispose: ReturnType<typeof vi.fn> }).dispose
    ).toHaveBeenCalled();
  });
});
