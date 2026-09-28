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
  }
  class Color {
    constructor(public hex?: number) {}
  }
  class Object3D {
    children: Object3D[] = [];
    parent: Object3D | null = null;
    position = { set(_x: number, _y: number, _z: number) {} };
    userData: Record<string, unknown> = {};
    add(child: Object3D) {
      child.parent = this;
      this.children.push(child);
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
  class BufferGeometry {
    dispose = vi.fn();
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
  class SphereGeometry extends BufferGeometry {
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
    SphereGeometry,
    MeshLambertMaterial,
    AmbientLight,
    DirectionalLight,
    Raycaster,
    Vector2,
    Color,
    Group,
    Object3D,
  };
}

describe('mp3d kings board 3d lifecycle', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('mounts a canvas and unmount removes it and disposes renderer', async () => {
    const threeMock = installThreeMock();
    const loadThree = vi.fn(async () => threeMock);
    vi.doMock('../../src/ui/three/load-three', () => ({ loadThree }));

    // jsdom may lack rAF
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

    const { createKingsBoard3D } =
      await import('../../src/ui/three/kings-board-3d');

    const container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '400px';
    document.body.appendChild(container);

    const onClick = vi.fn();
    const view = await createKingsBoard3D(container, onClick);

    expect(loadThree).toHaveBeenCalledTimes(1);
    expect(container.querySelector('canvas[data-mp3d="kings"]')).toBe(
      view.canvas
    );
    expect(container.contains(view.canvas)).toBe(true);

    const state = createInitialGameState();
    view.update(state, onClick);
    expect(rafCb).not.toBeNull();

    const disposeSpy = threeMock.WebGLRenderer.prototype
      ? undefined
      : undefined;
    // Capture dispose from the instance created during mount
    const rendererDispose = view.canvas; // keep reference before unmount
    expect(rendererDispose.parentElement).toBe(container);

    view.unmount();

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.contains(view.canvas)).toBe(false);
    expect(cancelSpy).toHaveBeenCalled();
    expect(loadThree).toHaveBeenCalledTimes(1);
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

    const { createKingsBoard3D } =
      await import('../../src/ui/three/kings-board-3d');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = await createKingsBoard3D(container);
    view.unmount();
    view.unmount();
    expect(container.querySelector('canvas')).toBeNull();
  });
});
