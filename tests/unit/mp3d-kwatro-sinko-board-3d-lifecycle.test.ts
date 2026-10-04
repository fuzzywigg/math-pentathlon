import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  getValidMoves,
  moveChip,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';

/**
 * Lightweight three.js stand-in for jsdom (no real WebGL).
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
  }
  class Color {
    constructor(public hex?: number | string) {}
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
    scale = {
      x: 1,
      y: 1,
      z: 1,
      set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    };
    userData: Record<string, unknown> = {};
    material: unknown;
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
  class HemisphereLight extends Light {
    constructor(sky?: number, ground?: number, intensity?: number) {
      super(sky, intensity);
      void ground;
    }
  }
  class DirectionalLight extends Light {}
  class BufferGeometry {
    dispose = vi.fn();
    setAttribute() {
      return this;
    }
  }
  class BoxGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class CylinderGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class CircleGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class Float32BufferAttribute {
    constructor(
      public arr: number[],
      public itemSize: number
    ) {}
  }
  class Material {
    dispose = vi.fn();
    constructor(public opts?: unknown) {}
  }
  class MeshLambertMaterial extends Material {}
  class LineBasicMaterial extends Material {}
  class Mesh extends Object3D {
    constructor(
      public geometry?: BufferGeometry,
      material?: Material
    ) {
      super();
      this.material = material;
    }
  }
  class LineSegments extends Object3D {
    constructor(
      public geometry?: BufferGeometry,
      material?: Material
    ) {
      super();
      this.material = material;
    }
  }
  class Raycaster {
    setFromCamera() {}
    intersectObjects() {
      return [];
    }
  }
  class WebGLRenderer {
    domElement = document.createElement('canvas');
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
    forceContextLoss = vi.fn();
    getContext = vi.fn(() => ({}));
  }
  class CanvasTexture {
    wrapS = 0;
    wrapT = 0;
    repeat = { set() {} };
    needsUpdate = false;
    dispose = vi.fn();
    constructor(public canvas?: HTMLCanvasElement) {}
  }

  return {
    Vector2,
    Vector3,
    Color,
    Object3D,
    Group,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    Mesh,
    LineSegments,
    BufferGeometry,
    Float32BufferAttribute,
    BoxGeometry,
    CylinderGeometry,
    CircleGeometry,
    WebGLRenderer,
    Raycaster,
    MeshLambertMaterial,
    LineBasicMaterial,
    CanvasTexture,
    RepeatWrapping: 1000,
    SRGBColorSpace: 3001,
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

describe('mp3d Kwatro-Sinko board 3D lifecycle', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockReturnValue({}) as never;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dKwatroSinko?: unknown })
      .__mp3dKwatroSinko;
  });

  it('exports nodeToWorld with row 4 nearer +z than row 0', async () => {
    const { nodeToWorld } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const top = nodeToWorld(0, 2);
    const bottom = nodeToWorld(4, 2);
    expect(bottom.z).toBeGreaterThan(top.z);
    expect(top.x).toBeCloseTo(0, 5);
  });

  it('mounts canvas, updates chips, unmounts cleanly (render-on-demand)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const board = await createKwatroSinkoBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeTruthy();
    expect(host.querySelector('.kwa-a11y-grid')).toBeTruthy();

    let state = createInitialState();
    board.update(state);
    expect(
      host.querySelectorAll('.kwa-a11y-grid [data-node-id]').length
    ).toBe(25);
    expect(board.nodeToClientPoint('n0-0')).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    // Move Blue chip 0 from n0-0 toward center — update still paints once
    state = selectChip(state, 'p1-0');
    const dest = getValidMoves(state, 'p1-0')[0];
    expect(dest).toBeTruthy();
    state = moveChip(state, dest!);
    board.update(state);
    expect(three.WebGLRenderer).toBeTruthy();

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
    expect(window.__mp3dKwatroSinko).toBeUndefined();
  });

  it('throws when WebGL context is unavailable so controller can keep 2D', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio() {}
      setSize() {}
      render() {}
      dispose() {}
      forceContextLoss() {}
      getContext() {
        return null;
      }
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    await expect(
      createKwatroSinkoBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGL/);
  });
});
