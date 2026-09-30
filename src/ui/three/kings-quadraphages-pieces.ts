/**
 * Shared Kings & Quadraphages 3D piece geometries.
 * Kings are chess-king silhouettes (lathe body + cross finial);
 * Quadraphages are flat chip discs.
 */

import type { ThreeModule } from './load-three';

type Three = ThreeModule;
type Group = InstanceType<Three['Group']>;
type Material = InstanceType<Three['Material']>;
type DisposableGeo = { dispose: () => void };

/** Lathe profile as [radius, y] in cell units (1 cell = 1.0). */
export const KING_LATHE_PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.0],
  [0.34, 0.0],
  [0.34, 0.06],
  [0.3, 0.09],
  [0.26, 0.12],
  [0.2, 0.18],
  [0.16, 0.3],
  [0.13, 0.46],
  [0.19, 0.5],
  [0.19, 0.54],
  [0.12, 0.56],
  [0.14, 0.62],
  [0.2, 0.72],
  [0.2, 0.75],
  [0.12, 0.78],
  [0.0, 0.8],
];

export interface KingGeometries {
  body: DisposableGeo;
  crossV: DisposableGeo;
  crossH: DisposableGeo;
}

export function createKingGeometries(THREE: Three): KingGeometries {
  const points = KING_LATHE_PROFILE.map(
    ([radius, y]) => new THREE.Vector2(radius, y)
  );
  return {
    body: new THREE.LatheGeometry(points, 32),
    crossV: new THREE.BoxGeometry(0.06, 0.18, 0.06),
    crossH: new THREE.BoxGeometry(0.15, 0.05, 0.06),
  };
}

export function createChipGeometry(THREE: Three): DisposableGeo {
  return new THREE.CylinderGeometry(0.36, 0.36, 0.08, 32);
}

export function disposeKingGeometries(geos: KingGeometries): void {
  geos.body.dispose();
  geos.crossV.dispose();
  geos.crossH.dispose();
}

/**
 * Assemble one chess-king Group (shared geos + seat material).
 * Caller sets world position; group local origin sits on the tile top.
 */
export function assembleKingGroup(
  THREE: Three,
  geos: KingGeometries,
  material: Material,
  row: number,
  col: number,
  owner: string
): Group {
  const group = new THREE.Group();
  // Geometries are created by the matching THREE constructors above.
  const body = new THREE.Mesh(geos.body as never, material);
  const crossV = new THREE.Mesh(geos.crossV as never, material);
  crossV.position.y = 0.89;
  const crossH = new THREE.Mesh(geos.crossH as never, material);
  crossH.position.y = 0.92;
  group.add(body);
  group.add(crossV);
  group.add(crossH);
  group.userData = { row, col, kind: 'king', owner };
  return group;
}
