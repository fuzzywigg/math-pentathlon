/**
 * Shared lightweight three.js stand-in for jsdom board-3d characterization.
 * No real WebGL — Raycaster hits are injectable via `hitQueue`.
 */
import { vi } from 'vitest';

export type Mp3dHit = {
  object: { userData?: Record<string, unknown>; parent?: unknown };
};

export function installCanvas2dStub(): void {
  HTMLCanvasElement.prototype.getContext = vi.fn(function (
    this: HTMLCanvasElement,
    type: string
  ) {
    if (type === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: 'center',
        textBaseline: 'middle',
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        fillText: vi.fn(),
        closePath: vi.fn(),
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
      };
    }
    return {};
  }) as never;
}

export function installThreeMock(options?: { hitQueue?: Mp3dHit[][] }) {
  const hitQueue = options?.hitQueue ?? [];
  const createdGeos: { dispose: ReturnType<typeof vi.fn> }[] = [];
  const createdMats: { dispose: ReturnType<typeof vi.fn>; opts?: unknown }[] =
    [];

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
    clone() {
      return new Color(this.hex);
    }
    lerp(_other: Color, _t: number) {
      return this;
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
    setAttribute() {
      return this;
    }
    rotateX(_angle: number) {
      return this;
    }
    rotateY(_angle: number) {
      return this;
    }
    rotateZ(_angle: number) {
      return this;
    }
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
  class TorusGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class SphereGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class ExtrudeGeometry extends BufferGeometry {
    constructor(_shape: unknown, _opts?: unknown) {
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
  class PlaneGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
      super();
    }
  }
  class CircleGeometry extends BufferGeometry {
    constructor(..._args: number[]) {
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
  class Float32BufferAttribute {
    constructor(
      public arr: number[],
      public itemSize: number
    ) {}
  }
  class Material {
    dispose = vi.fn();
    color = new Color();
    emissive = new Color();
    constructor(public opts?: unknown) {
      createdMats.push(this);
    }
    clone() {
      return new Material(this.opts);
    }
  }
  class MeshLambertMaterial extends Material {}
  class LineBasicMaterial extends Material {}
  class MeshBasicMaterial extends Material {}
  class Mesh extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material) {
      super();
      this.geometry = geometry;
      this.material = material;
    }
  }
  class LineSegments extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material) {
      super();
      this.geometry = geometry;
      this.material = material;
    }
  }
  class CanvasTexture {
    wrapS = 0;
    wrapT = 0;
    needsUpdate = false;
    colorSpace: unknown;
    repeat = { set: vi.fn() };
    dispose = vi.fn();
    constructor(public canvas?: HTMLCanvasElement) {}
  }
  class Raycaster {
    setFromCamera() {}
    intersectObjects() {
      return hitQueue.length > 0 ? hitQueue.shift()! : [];
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
    TorusGeometry,
    SphereGeometry,
    ExtrudeGeometry,
    LatheGeometry,
    RingGeometry,
    PlaneGeometry,
    CircleGeometry,
    Shape,
    WebGLRenderer,
    Raycaster,
    MeshLambertMaterial,
    LineBasicMaterial,
    MeshBasicMaterial,
    CanvasTexture,
    RepeatWrapping: 1000,
    __createdGeos: createdGeos,
    __createdMats: createdMats,
    __hitQueue: hitQueue,
  };
}

export function stubCanvasLayout(canvas: HTMLCanvasElement): void {
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 400,
    bottom: 400,
    width: 400,
    height: 400,
    x: 0,
    y: 0,
    toJSON() {
      return {};
    },
  });
}

export function dispatchTap(
  target: HTMLElement,
  clientX = 200,
  clientY = 200
): void {
  const common = {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    pointerType: 'mouse',
    button: 0,
    clientX,
    clientY,
  };
  target.dispatchEvent(new PointerEvent('pointerdown', common));
  target.dispatchEvent(new PointerEvent('pointerup', common));
}
