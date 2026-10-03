import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

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
    set(hex: number | string) {
      this.hex = hex;
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
    geometry: unknown;
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
  class TorusGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class ExtrudeGeometry extends BufferGeometry {
    constructor(_shape: unknown, _opts?: unknown) {
      super();
    }
  }
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
  class Material {
    dispose = vi.fn();
    color = new Color();
    constructor(public opts?: unknown) {}
  }
  class MeshLambertMaterial extends Material {}
  class Mesh extends Object3D {
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
    BufferGeometry,
    BoxGeometry,
    CylinderGeometry,
    TorusGeometry,
    ExtrudeGeometry,
    Shape,
    WebGLRenderer,
    Raycaster,
    MeshLambertMaterial,
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

describe('mp3d Hex-a-Gone board 3D lifecycle', () => {
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
    delete (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone;
  });

  it('mounts canvas, updates pieces, unmounts cleanly (render-on-demand)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const board = await createHexAGoneBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="hex-a-gone"]')).toBeTruthy();
    expect(host.querySelector('.hex-a-gone-a11y-grid')).toBeTruthy();

    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    state = placeBlock(state, 0, 0);
    board.update(state);

    expect(
      host.querySelector('.hex-a-gone-a11y-grid [data-q="0"][data-r="0"]')
    ).toBeTruthy();
    expect(board.cellToClientPoint(0, 0)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    expect(
      (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone
    ).toBeTruthy();

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
    expect(
      (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone
    ).toBeUndefined();
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
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    await expect(
      createHexAGoneBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGL/);
  });
});
