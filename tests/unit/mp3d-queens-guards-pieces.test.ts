import { describe, it, expect, vi } from 'vitest';

function installThreeStub() {
  class Vector2 {
    constructor(
      public x = 0,
      public y = 0
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
      public w?: number,
      public h?: number,
      public d?: number
    ) {
      super();
    }
  }
  class SphereGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
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
  class Material {}
  return {
    Vector2,
    LatheGeometry,
    BoxGeometry,
    SphereGeometry,
    Group,
    Mesh,
    Material,
  };
}

describe('mp3d Queens & Guards pieces', () => {
  it('builds distinct queen and guard geos and assembles groups', async () => {
    const THREE = installThreeStub();
    const {
      createQueensGuardsPieceGeometries,
      disposeQueensGuardsPieceGeometries,
      assembleQueenGroup,
      assembleGuardGroup,
      QUEEN_LATHE_PROFILE,
      GUARD_LATHE_PROFILE,
    } = await import('../../src/ui/three/queens-guards-pieces');

    expect(QUEEN_LATHE_PROFILE.length).toBeGreaterThan(
      GUARD_LATHE_PROFILE.length
    );

    const geos = createQueensGuardsPieceGeometries(THREE as never);
    const mat = new THREE.Material();
    const queen = assembleQueenGroup(
      THREE as never,
      geos,
      mat as never,
      5,
      7,
      'player1'
    );
    const guard = assembleGuardGroup(
      THREE as never,
      geos,
      mat as never,
      5,
      1,
      'player2'
    );

    expect(queen.userData).toMatchObject({
      kind: 'queen',
      owner: 'player1',
      ring: 5,
      position: 7,
    });
    expect(guard.userData).toMatchObject({
      kind: 'guard',
      owner: 'player2',
      ring: 5,
      position: 1,
    });
    expect(queen.children.length).toBeGreaterThanOrEqual(3);
    expect(guard.children.length).toBeGreaterThanOrEqual(2);

    disposeQueensGuardsPieceGeometries(geos);
    expect(geos.queenBody.dispose).toHaveBeenCalled();
    expect(geos.guardBody.dispose).toHaveBeenCalled();
  });
});
