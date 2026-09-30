import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

/**
 * Lightweight three.js stand-in for jsdom (no real WebGL).
 * Enough for mount / update / unmount lifecycle assertions.
 */
function installThreeMock() {
  class Vector2 {
    x = 0;
    y = 0;
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  }
  class Vector3 {
    x = 0;
    y = 0;
    z = 0;
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    project(_camera: unknown) {
      return this;
    }
    clone() {
      return new Vector3().set(this.x, this.y, this.z);
    }
    multiplyScalar(s: number) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }
  }
  class Color {
    constructor(public hex?: number | string) {}
    clone() {
      return new Color(this.hex);
    }
    multiplyScalar(_s: number) {
      return this;
    }
  }
  class Object3D {
    children: Object3D[] = [];
    parent: Object3D | null = null;
    position = {
      x: 0,
      y: 0,
      z: 0,
      set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    };
    rotation = { x: 0, y: 0, z: 0 };
    userData: Record<string, unknown> = {};
    add(...kids: Object3D[]) {
      for (const child of kids) {
        child.parent = this;
        this.children.push(child);
      }
    }
    remove(child: Object3D) {
      this.children = this.children.filter((c) => c !== child);
      child.parent = null;
    }
    traverse(fn: (o: Object3D) => void) {
      fn(this);
      for (const c of [...this.children]) c.traverse(fn);
    }
  }
  class Group extends Object3D {}
  class Scene extends Object3D {
    background: Color | null = null;
  }
  class PerspectiveCamera extends Object3D {
    aspect = 1;
    constructor(
      public fov: number,
      aspect: number,
      public near: number,
      public far: number
    ) {
      super();
      this.aspect = aspect;
    }
    lookAt() {}
    updateProjectionMatrix() {}
  }
  class Light extends Object3D {
    constructor(
      public color?: number,
      public intensity?: number
    ) {
      super();
    }
  }
  class AmbientLight extends Light {}
  class DirectionalLight extends Light {}
  class HemisphereLight extends Light {
    constructor(
      public sky?: number,
      public ground?: number,
      intensity?: number
    ) {
      super(sky, intensity);
    }
  }
  const createdGeos: Array<{ dispose: ReturnType<typeof vi.fn> }> = [];
  class BufferGeometry {
    dispose = vi.fn();
    constructor() {
      createdGeos.push(this);
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
  class CylinderGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class LatheGeometry extends BufferGeometry {
    constructor(
      public points: Vector2[],
      public segments: number
    ) {
      super();
    }
  }
  class RingGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class Material {
    dispose = vi.fn();
    constructor(public opts?: unknown) {}
  }
  class MeshLambertMaterial extends Material {}
  class Mesh extends Object3D {
    constructor(
      public geometry: BufferGeometry,
      public material: Material
    ) {
      super();
    }
  }
  class Raycaster {
    setFromCamera() {}
    intersectObjects() {
      return [];
    }
  }
  class WebGLRenderer {
    domElement: HTMLCanvasElement;
    dispose = vi.fn();
    forceContextLoss = vi.fn();
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn();
    constructor() {
      this.domElement = document.createElement('canvas');
    }
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    CylinderGeometry,
    LatheGeometry,
    RingGeometry,
    MeshLambertMaterial,
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    Raycaster,
    Vector2,
    Vector3,
    Color,
    Group,
    Object3D,
    BufferGeometry,
    __createdGeos: createdGeos,
  };
}

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('mp3d Kings & Quadraphages board 3d lifecycle', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('mounts a canvas and unmount removes it and disposes shared geos', async () => {
    const threeMock = installThreeMock();
    const loadThree = vi.fn(async () => threeMock);
    vi.doMock('../../src/ui/three/load-three', () => ({ loadThree }));

    let rafCb: FrameRequestCallback | null = null;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: FrameRequestCallback) => {
        rafCb = cb;
        return 1;
      })
    );
    const cancelSpy = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelSpy);

    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');

    const container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '400px';
    document.body.appendChild(container);

    const onClick = vi.fn();
    const view = await createKingsQuadraphagesBoard3D(container, onClick);

    expect(loadThree).toHaveBeenCalledTimes(1);
    expect(
      container.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBe(view.canvas);
    expect(view.canvas.getAttribute('role')).toBe('img');
    expect(view.canvas.getAttribute('aria-label')).toContain(
      'Kings & Quadraphages'
    );
    expect(container.contains(view.canvas)).toBe(true);

    const state = createInitialGameState();
    view.update(state, onClick);
    expect(rafCb).not.toBeNull();
    expect(view.cellToClientPoint(1, 5)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    expect(view.canvas.parentElement).toBe(container);

    const geosBeforeUnmount = threeMock.__createdGeos.length;
    expect(geosBeforeUnmount).toBeGreaterThan(0);

    view.unmount();

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.contains(view.canvas)).toBe(false);
    expect(cancelSpy).toHaveBeenCalled();
    expect(loadThree).toHaveBeenCalledTimes(1);
    // Shared king lathe/cross, chip, crest ring, and tile geos all dispose once.
    for (const geo of threeMock.__createdGeos) {
      expect(geo.dispose).toHaveBeenCalled();
    }
  });

  it('unmount is idempotent', async () => {
    const threeMock = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1)
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = await createKingsQuadraphagesBoard3D(container);
    view.unmount();
    view.unmount();
    expect(container.querySelector('canvas')).toBeNull();
  });
});
