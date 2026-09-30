import { describe, it, expect, vi } from 'vitest';
import {
  createKingGeometries,
  createChipGeometry,
  disposeKingGeometries,
  assembleKingGroup,
  KING_LATHE_PROFILE,
} from '../../src/ui/three/kings-quadraphages-pieces';

function fakeThree() {
  class Vector2 {
    constructor(
      public x: number,
      public y: number
    ) {}
  }
  class BufferGeometry {
    dispose = vi.fn();
  }
  class LatheGeometry extends BufferGeometry {
    constructor(
      public points: Vector2[],
      public segments: number
    ) {
      super();
    }
  }
  class BoxGeometry extends BufferGeometry {
    constructor(
      public w: number,
      public h: number,
      public d: number
    ) {
      super();
    }
  }
  class CylinderGeometry extends BufferGeometry {
    constructor(
      public rt: number,
      public rb: number,
      public h: number,
      public seg: number
    ) {
      super();
    }
  }
  class Object3D {
    children: Object3D[] = [];
    position = { x: 0, y: 0, z: 0, set() {} };
    userData: Record<string, unknown> = {};
    add(...kids: Object3D[]) {
      this.children.push(...kids);
    }
  }
  class Group extends Object3D {}
  class Mesh extends Object3D {
    constructor(
      public geometry: BufferGeometry,
      public material: unknown
    ) {
      super();
    }
  }
  return {
    Vector2,
    LatheGeometry,
    BoxGeometry,
    CylinderGeometry,
    Group,
    Mesh,
    BufferGeometry,
  };
}

describe('mp3d Kings & Quadraphages piece geometries', () => {
  it('createKingGeometries builds lathe body + cross boxes', () => {
    const THREE = fakeThree();
    const geos = createKingGeometries(THREE as never);
    expect(geos.body).toBeInstanceOf(THREE.LatheGeometry);
    expect(
      (geos.body as InstanceType<typeof THREE.LatheGeometry>).segments
    ).toBe(32);
    expect(
      (geos.body as InstanceType<typeof THREE.LatheGeometry>).points
    ).toHaveLength(KING_LATHE_PROFILE.length);
    expect(geos.crossV).toBeInstanceOf(THREE.BoxGeometry);
    expect(geos.crossH).toBeInstanceOf(THREE.BoxGeometry);
    disposeKingGeometries(geos);
    expect(geos.body.dispose).toHaveBeenCalled();
    expect(geos.crossV.dispose).toHaveBeenCalled();
    expect(geos.crossH.dispose).toHaveBeenCalled();
  });

  it('createChipGeometry builds a flat disc cylinder', () => {
    const THREE = fakeThree();
    const chip = createChipGeometry(THREE as never) as InstanceType<
      typeof THREE.CylinderGeometry
    >;
    expect(chip).toBeInstanceOf(THREE.CylinderGeometry);
    expect(chip.rt).toBe(0.36);
    expect(chip.rb).toBe(0.36);
    expect(chip.h).toBe(0.08);
  });

  it('assembleKingGroup puts body + cross in one group with king userData', () => {
    const THREE = fakeThree();
    const geos = createKingGeometries(THREE as never);
    const group = assembleKingGroup(THREE as never, geos, {}, 1, 5, 'player1');
    expect(group.children).toHaveLength(3);
    expect(group.userData).toEqual({
      row: 1,
      col: 5,
      kind: 'king',
      owner: 'player1',
    });
  });
});
