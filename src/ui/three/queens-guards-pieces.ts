/**
 * Shared Queens & Guards 3D piece geometries.
 * Queens and Guards are distinct lathe-turned silhouettes (original, not kit photos).
 */

import type { ThreeModule } from './load-three';

type Three = ThreeModule;
type Group = InstanceType<Three['Group']>;
type Material = InstanceType<Three['Material']>;
type DisposableGeo = { dispose: () => void };

/** Lathe profile as [radius, y] in world units. */
export const QUEEN_LATHE_PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.0],
  [0.28, 0.0],
  [0.28, 0.05],
  [0.24, 0.08],
  [0.18, 0.14],
  [0.14, 0.28],
  [0.12, 0.42],
  [0.16, 0.48],
  [0.16, 0.52],
  [0.1, 0.54],
  [0.14, 0.6],
  [0.2, 0.68],
  [0.18, 0.72],
  [0.1, 0.76],
  [0.0, 0.78],
];

/** Shorter guard silhouette — readable pawn-like tower. */
export const GUARD_LATHE_PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.0],
  [0.24, 0.0],
  [0.24, 0.04],
  [0.2, 0.07],
  [0.16, 0.12],
  [0.14, 0.22],
  [0.13, 0.34],
  [0.16, 0.38],
  [0.16, 0.42],
  [0.1, 0.44],
  [0.0, 0.48],
];

export interface QueensGuardsPieceGeometries {
  queenBody: DisposableGeo;
  queenCrownV: DisposableGeo;
  queenCrownH: DisposableGeo;
  guardBody: DisposableGeo;
  guardCap: DisposableGeo;
}

export function createQueensGuardsPieceGeometries(
  THREE: Three
): QueensGuardsPieceGeometries {
  const queenPts = QUEEN_LATHE_PROFILE.map(
    ([radius, y]) => new THREE.Vector2(radius, y)
  );
  const guardPts = GUARD_LATHE_PROFILE.map(
    ([radius, y]) => new THREE.Vector2(radius, y)
  );
  return {
    queenBody: new THREE.LatheGeometry(queenPts, 28),
    queenCrownV: new THREE.BoxGeometry(0.05, 0.16, 0.05),
    queenCrownH: new THREE.BoxGeometry(0.14, 0.045, 0.05),
    guardBody: new THREE.LatheGeometry(guardPts, 24),
    guardCap: new THREE.SphereGeometry(0.1, 12, 10),
  };
}

export function disposeQueensGuardsPieceGeometries(
  geos: QueensGuardsPieceGeometries
): void {
  geos.queenBody.dispose();
  geos.queenCrownV.dispose();
  geos.queenCrownH.dispose();
  geos.guardBody.dispose();
  geos.guardCap.dispose();
}

/**
 * Assemble one queen Group (shared geos + seat material).
 * Local origin sits on the hex tile top.
 */
export function assembleQueenGroup(
  THREE: Three,
  geos: QueensGuardsPieceGeometries,
  material: Material,
  ring: number,
  position: number,
  owner: string
): Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(geos.queenBody as never, material);
  const crownV = new THREE.Mesh(geos.queenCrownV as never, material);
  crownV.position.y = 0.86;
  const crownH = new THREE.Mesh(geos.queenCrownH as never, material);
  crownH.position.y = 0.9;
  group.add(body);
  group.add(crownV);
  group.add(crownH);
  group.userData = { ring, position, kind: 'queen', owner };
  return group;
}

/**
 * Assemble one guard Group (shared geos + seat material).
 */
export function assembleGuardGroup(
  THREE: Three,
  geos: QueensGuardsPieceGeometries,
  material: Material,
  ring: number,
  position: number,
  owner: string
): Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(geos.guardBody as never, material);
  const cap = new THREE.Mesh(geos.guardCap as never, material);
  cap.position.y = 0.5;
  group.add(body);
  group.add(cap);
  group.userData = { ring, position, kind: 'guard', owner };
  return group;
}
