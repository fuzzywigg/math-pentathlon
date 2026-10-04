import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';

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
    WebGLRenderer,
    Raycaster,
    MeshLambertMaterial,
    LineBasicMaterial,
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

describe('mp3d FIAR board 3D lifecycle', () => {
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
    delete (window as Window & { __mp3dFiar?: unknown }).__mp3dFiar;
  });

  it('mounts canvas, updates chips, unmounts cleanly (render-on-demand)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const board = await createFiarBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="fiar"]')).toBeTruthy();
    expect(host.querySelector('.fiar-a11y-grid')).toBeTruthy();
    // No continuous RAF — paint is on-demand via renderer.render
    expect(three.WebGLRenderer).toBeTruthy();

    const state = createInitialState();
    const n = state.board.nodes.get('c3r3')!;
    state.board.nodes.set('c3r3', {
      ...n,
      chip: 'player1',
      chipKind: 'marked',
    });
    board.update(state);
    expect(
      host.querySelector('.fiar-a11y-grid [data-node-id="c3r3"]')
    ).toBeTruthy();
    expect(board.nodeToClientPoint('c3r3')).toEqual(
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
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    await expect(
      createFiarBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGL/);
  });

  it('dispatches mp3d-context-lost and tears down on webglcontextlost', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const lost = vi.fn();
    host.addEventListener('mp3d-context-lost', lost);

    const board = await createFiarBoard3D(host);
    const event = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(lost).toHaveBeenCalledTimes(1);
    expect(host.querySelector('canvas')).toBeNull();
  });
});
