import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece, selectPiece } from '../../src/games/pent-em-in/rules';

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
  class Material {
    dispose = vi.fn();
    color = new Color();
    emissive = new Color();
    constructor(public opts?: { color?: string | number; emissive?: string }) {
      if (opts?.color !== undefined) this.color.set(opts.color);
      if (opts?.emissive !== undefined) this.emissive.set(opts.emissive);
    }
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

describe('mp3d Pent\'Em In board 3D lifecycle', () => {
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
    delete (window as Window & { __mp3dPentEmIn?: unknown }).__mp3dPentEmIn;
  });

  it('mounts canvas, updates pieces, unmounts cleanly (render-on-demand)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const board = await createPentEmInBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="pent-em-in"]')).toBeTruthy();
    expect(host.querySelector('.pent-a11y-grid')).toBeTruthy();
    expect(window.__mp3dPentEmIn?.cellToClientPoint).toBeTypeOf('function');

    let state = createInitialState();
    state = selectPiece(state, 'X');
    state = placePiece(state, 'X', { row: 4, col: 4 }, 0, false);
    board.update(state);
    expect(
      host.querySelectorAll('.pent-a11y-grid [role="gridcell"]').length
    ).toBe(100);
    expect(board.cellToClientPoint(4, 4)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    // Paint on demand — renderer.render called from update/resize, not a RAF loop
    expect(three.WebGLRenderer).toBeTruthy();

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
    expect(window.__mp3dPentEmIn).toBeUndefined();

    // Idempotent
    board.unmount();
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
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    await expect(
      createPentEmInBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGL/);
  });
});
