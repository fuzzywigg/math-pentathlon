/**
 * Original pattern-block meshes for Hex-a-Gone! 3D.
 * Short extruded solids with a slight bevel — no kit photos or licensed art.
 */

import type { BlockShape } from '../../games/hex-a-gone/types';
import type { ThreeModule } from './load-three';

type Three = ThreeModule;
type ExtrudeGeo = InstanceType<Three['ExtrudeGeometry']>;

export const PIECE_HEIGHT = 0.2;
const BEVEL = 0.018;

export interface HexAGonePieceGeometries {
  hexagon: ExtrudeGeo;
  trapezoid: ExtrudeGeo;
  rhombus: ExtrudeGeo;
  triangle: ExtrudeGeo;
  square: ExtrudeGeo;
}

function extrudeShape(
  THREE: Three,
  shape: InstanceType<Three['Shape']>,
  depth = PIECE_HEIGHT
): ExtrudeGeo {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 1,
    curveSegments: 1,
  });
}

function closedPolygon(
  THREE: Three,
  points: ReadonlyArray<readonly [number, number]>
): InstanceType<Three['Shape']> {
  const shape = new THREE.Shape();
  const first = points[0]!;
  shape.moveTo(first[0], first[1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i]![0], points[i]![1]);
  }
  shape.closePath();
  return shape;
}

/** Flat-top hexagon outline in the Shape XY plane. */
function hexShape(THREE: Three, radius: number): InstanceType<Three['Shape']> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return closedPolygon(THREE, pts);
}

export function createHexAGonePieceGeometries(
  THREE: Three
): HexAGonePieceGeometries {
  const r = 0.42;
  return {
    hexagon: extrudeShape(THREE, hexShape(THREE, r)),
    trapezoid: extrudeShape(
      THREE,
      closedPolygon(THREE, [
        [-0.42, -0.22],
        [0.42, -0.22],
        [0.28, 0.28],
        [-0.28, 0.28],
      ])
    ),
    rhombus: extrudeShape(
      THREE,
      closedPolygon(THREE, [
        [0, -0.4],
        [0.32, 0],
        [0, 0.4],
        [-0.32, 0],
      ])
    ),
    triangle: extrudeShape(
      THREE,
      closedPolygon(THREE, [
        [0, 0.4],
        [0.4, -0.32],
        [-0.4, -0.32],
      ])
    ),
    square: extrudeShape(
      THREE,
      closedPolygon(THREE, [
        [-0.34, -0.34],
        [0.34, -0.34],
        [0.34, 0.34],
        [-0.34, 0.34],
      ])
    ),
  };
}

export function disposeHexAGonePieceGeometries(
  geos: HexAGonePieceGeometries
): void {
  geos.hexagon.dispose();
  geos.trapezoid.dispose();
  geos.rhombus.dispose();
  geos.triangle.dispose();
  geos.square.dispose();
}

export function geometryForShape(
  geos: HexAGonePieceGeometries,
  shape: BlockShape
): ExtrudeGeo {
  switch (shape) {
    case 'hexagon':
      return geos.hexagon;
    case 'trapezoid':
      return geos.trapezoid;
    case 'rhombus':
      return geos.rhombus;
    case 'triangle':
      return geos.triangle;
    case 'square':
      return geos.square;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
