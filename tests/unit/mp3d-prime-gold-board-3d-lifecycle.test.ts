import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';

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
    set(_v: unknown) {
      return this;
    }
    clone() {
      return new Color(this.hex);
    }
    lerp(_c: Color, _t: number) {
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
  class PlaneGeometry extends BufferGeometry {
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
    clone() {
      return new Material(this.opts);
    }
  }
  class MeshLambertMaterial extends Material {
    clone() {
      return new MeshLambertMaterial(this.opts);
    }
  }
  class LineBasicMaterial extends Material {}
  class CanvasTexture {
    needsUpdate = false;
    dispose = vi.fn();
    constructor(public canvas?: HTMLCanvasElement) {}
  }
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
    PlaneGeometry,
    CanvasTexture,
    WebGLRenderer,
    Raycaster,
    MeshLambertMaterial,
    LineBasicMaterial,
    SRGBColorSpace: 'srgb',
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

describe('mp3d Prime Gold board 3D lifecycle', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockReturnValue({
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        fillText: vi.fn(),
        createRadialGradient: () => ({
          addColorStop: vi.fn(),
        }),
      }) as never;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dPrimeGold?: unknown }).__mp3dPrimeGold;
  });

  it('mounts canvas, updates chips, unmounts cleanly (render-on-demand)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const board = await createPrimeGoldBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="prime-gold"]')).toBeTruthy();
    expect(host.querySelector('.pg-a11y-grid')).toBeTruthy();

    const state = createInitialState();
    // Own center cell so a chip mesh is created
    const center = state.cells.get('3,3')!;
    state.cells.set('3,3', { ...center, owner: 'player1' });
    board.update(state);
    expect(
      host.querySelector('.pg-a11y-grid [data-value="1"]')
    ).toBeTruthy();
    expect(board.cellToClientPoint(3, 3)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    expect(board.valueToClientPoint(1)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
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
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    await expect(
      createPrimeGoldBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGL/);
  });

  it('unmount is idempotent', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    board.update(createInitialState());
    board.unmount();
    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
  });
});
