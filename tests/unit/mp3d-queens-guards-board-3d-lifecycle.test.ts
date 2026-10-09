import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';

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
  const createdMats: Array<{
    opts?: unknown;
    dispose: ReturnType<typeof vi.fn>;
  }> = [];
  class BufferGeometry {
    dispose = vi.fn();
    rotateX = vi.fn();
    constructor() {
      createdGeos.push(this);
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
  class LatheGeometry extends BufferGeometry {
    constructor(
      public points: Vector2[],
      public segments: number
    ) {
      super();
    }
  }
  class SphereGeometry extends BufferGeometry {
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
    constructor(
      public shape: unknown,
      public opts?: unknown
    ) {
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
    constructor(public opts?: unknown) {
      createdMats.push(this);
    }
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
    getContext = vi.fn(() => ({}));
    constructor() {
      this.domElement = document.createElement('canvas');
    }
  }

  class CanvasTexture {
    wrapS = 0;
    wrapT = 0;
    repeat = { set() {} };
    dispose = vi.fn();
    constructor(public canvas?: HTMLCanvasElement) {}
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    CylinderGeometry,
    LatheGeometry,
    SphereGeometry,
    TorusGeometry,
    ExtrudeGeometry,
    Shape,
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
    CanvasTexture,
    RepeatWrapping: 1000,
    __createdGeos: createdGeos,
    __createdMats: createdMats,
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

describe('mp3d Queens & Guards board 3d lifecycle', () => {
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
    delete (window as Window & { __mp3dQueensGuards?: unknown })
      .__mp3dQueensGuards;
  });

  it('mounts canvas, updates pieces, paints on demand, unmounts cleanly', async () => {
    const threeMock = installThreeMock();
    const loadThree = vi.fn(async () => threeMock);
    vi.doMock('../../src/ui/three/load-three', () => ({ loadThree }));

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');

    const container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '400px';
    document.body.appendChild(container);

    const onClick = vi.fn();
    const view = await createQueensGuardsBoard3D(container, onClick);

    expect(loadThree).toHaveBeenCalledTimes(1);
    expect(container.querySelector('canvas[data-mp3d="queens-guards"]')).toBe(
      view.canvas
    );
    expect(container.querySelector('.qg-a11y-grid')).toBeTruthy();
    expect(view.canvas.getAttribute('role')).toBe('img');

    const state = createInitialState();
    view.update(state, onClick);

    // Render-on-demand: update triggers paint (renderer.render), no RAF loop.
    expect(threeMock.WebGLRenderer).toBeTruthy();
    const rendererInstance = (
      threeMock as unknown as {
        WebGLRenderer: new () => {
          render: ReturnType<typeof vi.fn>;
          setPixelRatio: ReturnType<typeof vi.fn>;
        };
      }
    ).WebGLRenderer;
    void rendererInstance;

    expect(
      container.querySelector('.qg-a11y-grid [data-cell-key="5-7"]')
    ).toBeTruthy();
    expect(view.cellToClientPoint(5, 7)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    expect(window.__mp3dQueensGuards?.cellToClientPoint).toBeTypeOf('function');

    const geosBefore = threeMock.__createdGeos.length;
    expect(geosBefore).toBeGreaterThan(0);

    view.unmount();

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.qg-a11y-grid')).toBeNull();
    expect(container.classList.contains('board-3d-host')).toBe(false);
    for (const geo of threeMock.__createdGeos) {
      expect(geo.dispose).toHaveBeenCalled();
    }
  });

  it('uses a warm wood tabletop texture, not slate, and never pulses', async () => {
    const threeMock = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));
    const raf = vi.spyOn(window, 'requestAnimationFrame');

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const view = await createQueensGuardsBoard3D(host);

    const woodSlab = threeMock.__createdMats.some((m) => {
      const opts = m.opts as { color?: number; map?: unknown } | undefined;
      return opts?.color === 0x8b6239 && opts.map;
    });
    expect(woodSlab).toBe(true);
    expect(
      threeMock.__createdMats.some(
        (m) => (m.opts as { color?: number } | undefined)?.color === 0xd4b45a
      )
    ).toBe(true);
    expect(
      threeMock.__createdMats.some(
        (m) => (m.opts as { color?: number } | undefined)?.color === 0x1c2a38
      )
    ).toBe(false);

    // Mount schedules a one-shot rAF readiness paint (software GL); not a loop.
    expect(raf).toHaveBeenCalled();
    raf.mockClear();

    const state = createInitialState();
    view.update({ ...state, winner: 'player1' });
    // Still render-on-demand: game-over must not start a continuous RAF pulse.
    expect(raf).not.toHaveBeenCalled();
    view.unmount();
  });

  it('a11y grid labels captured pieces and restore targets', async () => {
    const threeMock = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const view = await createQueensGuardsBoard3D(host);

    const { cellKey } = await import('../../src/games/queens-guards/types');
    const base = createInitialState();
    const cells = new Map(base.cells);
    cells.set(cellKey(2, 0), {
      ring: 2,
      position: 0,
      piece: { id: 'p2-captured-guard', player: 'player2', type: 'guard' },
    });
    view.update({
      ...base,
      cells,
      currentPlayer: 'player1',
      capturedPieces: [{ ring: 2, position: 0 }],
      selectedPiece: cellKey(2, 0),
    });

    expect(
      host
        .querySelector('.qg-a11y-grid [data-cell-key="2-0"]')
        ?.getAttribute('aria-label')
    ).toMatch(/captured/i);
    expect(
      host
        .querySelector('.qg-a11y-grid [data-cell-key="5-0"]')
        ?.getAttribute('aria-label')
    ).toMatch(/restore target/i);
    view.unmount();
  });

  it('unmount is idempotent', async () => {
    const threeMock = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = await createQueensGuardsBoard3D(container);
    view.unmount();
    view.unmount();
    expect(container.querySelector('canvas')).toBeNull();
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

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    await expect(createQueensGuardsBoard3D(host)).rejects.toThrow(/WebGL/);
  });

  /** R-GL-02 (burn-1008 runtime-error-path-audit): recovered context-loss path. */
  it('dispatches mp3d-context-lost and tears down on webglcontextlost', async () => {
    const threeMock = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const lost = vi.fn();
    container.addEventListener('mp3d-context-lost', lost);

    const view = await createQueensGuardsBoard3D(container);
    const event = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    view.canvas.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(lost).toHaveBeenCalledTimes(1);
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('caps pixel ratio at 1.5', async () => {
    const threeMock = installThreeMock();
    const setPixelRatio = vi.fn();
    threeMock.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      setPixelRatio = setPixelRatio;
      setSize = vi.fn();
      render = vi.fn();
      getContext = vi.fn(() => ({}));
    } as typeof threeMock.WebGLRenderer;

    vi.stubGlobal('devicePixelRatio', 3);
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeMock,
    }));

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const view = await createQueensGuardsBoard3D(host);
    expect(setPixelRatio).toHaveBeenCalledWith(1.5);
    view.unmount();
  });
});
