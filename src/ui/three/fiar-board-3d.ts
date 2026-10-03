/**
 * Three.js tilted-tabletop 3D board for FIAR.
 *
 * Tablet-friendly vs Kings #352:
 * - antialias off, pixelRatio capped at 1.5
 * - render-on-demand (no continuous RAF)
 * - full-size host
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 */

import type { FiarGameState, Player } from '../../games/fiar/types';
import { CONFIG, parseNodeId } from '../../games/fiar/types';
import {
  getValidMoves,
  getSelectableNodes,
  canPlaceChip,
} from '../../games/fiar/rules';
import { getPlayerSeatColors } from '../player-colors';
import { loadThree, type ThreeModule } from './load-three';

export type FiarNodeClickCallback = (nodeId: string) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type LineSegments = InstanceType<Three['LineSegments']>;

const NODE_R = 0.38;
const CHIP_R = 0.3;
const CHIP_H = 0.12;
const BOARD_Y = 0;

export interface FiarBoard3D {
  update(state: FiarGameState, onNodeClick?: FiarNodeClickCallback): void;
  unmount(): void;
  nodeToClientPoint(nodeId: string): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __mp3dFiar?: {
      nodeToClientPoint: (nodeId: string) => { x: number; y: number } | null;
    };
  }
}

/** Layout world coords: col/row → x/z centered on yellow diamond. */
function nodeToWorld(col: number, row: number): { x: number; z: number } {
  return { x: col - 4, z: row - 3 };
}

/**
 * Create and mount a 3D FIAR board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createFiarBoard3D(
  container: HTMLElement,
  onNodeClick?: FiarNodeClickCallback
): Promise<FiarBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'fiar-board-3d-host');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.aspectRatio = '9 / 7';
  container.style.minHeight = 'min(420px, 70vw)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Deep blue → warm flame atmosphere (original procedural look, not kit photos)
  scene.background = new THREE.Color(0x0b1524);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 11.2, 9.4);
  camera.lookAt(0, 0, 0.2);

  let renderer: InstanceType<Three['WebGLRenderer']>;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    });
    // Prefer renderer.getContext(); avoid a second getContext on the canvas
    // (jsdom / test doubles often stub HTMLCanvasElement.prototype).
    const gl =
      typeof renderer.getContext === 'function'
        ? renderer.getContext()
        : renderer.domElement.getContext('webgl') ||
          renderer.domElement.getContext('experimental-webgl');
    if (!gl) {
      renderer.dispose();
      throw new Error('WebGL context unavailable');
    }
  } catch (err) {
    throw new Error(
      `WebGLRenderer failed — FIAR 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'fiar');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'FIAR 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  // Visually-hidden a11y grid (keyboard) — kept in sync by update()
  const a11y = document.createElement('div');
  a11y.className = 'fiar-a11y-grid';
  a11y.setAttribute('role', 'grid');
  a11y.setAttribute('aria-label', 'FIAR board spaces');
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  container.appendChild(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xffe0b2, 0x1a2332, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff3e0, 0.8);
  key.position.set(4, 14, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff6a00, 0.25);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);

  // Board slab with warm edge glow feel
  const slabGeo = new THREE.BoxGeometry(10.2, 0.18, 8.2);
  const slabMat = new THREE.MeshLambertMaterial({ color: 0x122033 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = BOARD_Y - 0.12;
  root.add(slab);

  // Flame rim (thin orange torus-ish boxes at edges)
  const rimMat = new THREE.MeshLambertMaterial({ color: 0xe65c00 });
  for (const [x, z, sx, sz] of [
    [0, -3.9, 10.2, 0.35],
    [0, 3.9, 10.2, 0.35],
    [-4.95, 0, 0.35, 8.2],
    [4.95, 0, 0.35, 8.2],
  ] as const) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.08, sz), rimMat);
    edge.position.set(x, BOARD_Y - 0.02, z);
    root.add(edge);
  }

  const seats = getPlayerSeatColors();
  const mats = {
    space: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
    spaceHover: new THREE.MeshLambertMaterial({ color: 0xd8cbb8 }),
    spaceValid: new THREE.MeshLambertMaterial({ color: 0x66bb6a }),
    edge: new THREE.LineBasicMaterial({ color: 0xd32f2f }),
    diamond: new THREE.MeshLambertMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0.85,
    }),
    p1: new THREE.MeshLambertMaterial({ color: seats.player1 }),
    p2: new THREE.MeshLambertMaterial({ color: seats.player2 }),
    markedDot: new THREE.MeshLambertMaterial({ color: 0x2e7d32 }),
    selected: new THREE.MeshLambertMaterial({ color: 0xff9800 }),
  };

  const spaceGeo = new THREE.CylinderGeometry(NODE_R, NODE_R, 0.06, 20);
  const chipGeo = new THREE.CylinderGeometry(CHIP_R, CHIP_R, CHIP_H, 20);
  const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);
  const diamondGeo = new THREE.BoxGeometry(1.35, 0.05, 1.35);

  // Yellow diamond at c4r3
  const diamond = new THREE.Mesh(diamondGeo, mats.diamond);
  diamond.rotation.y = Math.PI / 4;
  diamond.position.set(0, BOARD_Y + 0.04, 0);
  diamond.userData = { kind: 'diamond' };
  root.add(diamond);

  interface NodeMeshes {
    id: string;
    col: number;
    row: number;
    pad: Mesh;
    chip: Mesh | null;
    dot: Mesh | null;
  }

  const nodeMeshes = new Map<string, NodeMeshes>();
  let edgeLines: LineSegments | null = null;
  let clickHandler: FiarNodeClickCallback | undefined = onNodeClick;
  let disposed = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projectScratch = new THREE.Vector3();

  const paint = (): void => {
    if (disposed) return;
    renderer.render(scene, camera);
  };

  const resize = (): void => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 480, 120);
    const h = Math.max(container.clientHeight || 360, 120);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    paint();
  };

  const onPointer = (event: PointerEvent): void => {
    if (!clickHandler || disposed) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const id = obj.userData?.nodeId as string | undefined;
        if (id) {
          clickHandler(id);
          return;
        }
        obj = obj.parent;
      }
    }
  };

  const onResize = (): void => resize();
  canvas.addEventListener('pointerup', onPointer);
  window.addEventListener('resize', onResize);

  const clearChip = (nm: NodeMeshes): void => {
    if (nm.chip) {
      root.remove(nm.chip);
      nm.chip = null;
    }
    if (nm.dot) {
      root.remove(nm.dot);
      nm.dot = null;
    }
  };

  const syncA11y = (
    state: FiarGameState,
    handler?: FiarNodeClickCallback
  ): void => {
    a11y.replaceChildren();
    const valid = state.selectedNode
      ? getValidMoves(state, state.selectedNode)
      : [];
    const selectable = getSelectableNodes(state);
    for (const [id, node] of state.board.nodes) {
      const parsed = parseNodeId(id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('data-node-id', id);
      if (parsed) {
        btn.setAttribute('data-row', String(parsed.row));
        btn.setAttribute('data-col', String(parsed.col));
      }
      const owner =
        node.chip === 'player1'
          ? 'Blue'
          : node.chip === 'player2'
            ? 'Red'
            : 'empty';
      btn.setAttribute(
        'aria-label',
        `${parsed ? `${parsed.row},${parsed.col}` : id}, ${owner}`
      );
      btn.tabIndex = -1;
      if (
        (state.phase === 'placement' &&
          node.chip === null &&
          canPlaceChip(state, id)) ||
        selectable.includes(id) ||
        valid.includes(id)
      ) {
        btn.tabIndex = 0;
      }
      btn.addEventListener('click', () => handler?.(id));
      a11y.appendChild(btn);
    }
    // Ensure at least one tab stop
    if (!a11y.querySelector('[tabindex="0"]')) {
      const first = a11y.querySelector('button');
      if (first) first.tabIndex = 0;
    }
  };

  const update = (
    state: FiarGameState,
    nextClick?: FiarNodeClickCallback
  ): void => {
    if (disposed) return;
    clickHandler = nextClick;

    // Build pads / edges once from layout
    if (nodeMeshes.size === 0) {
      for (const [id] of state.board.nodes) {
        const parsed = parseNodeId(id);
        if (!parsed) continue;
        const { x, z } = nodeToWorld(parsed.col, parsed.row);
        const pad = new THREE.Mesh(spaceGeo, mats.space);
        pad.position.set(x, BOARD_Y + 0.03, z);
        pad.userData = { nodeId: id, kind: 'space' };
        root.add(pad);
        nodeMeshes.set(id, {
          id,
          col: parsed.col,
          row: parsed.row,
          pad,
          chip: null,
          dot: null,
        });
      }

      const positions: number[] = [];
      for (const edge of state.board.edges) {
        const a = parseNodeId(edge.from);
        const b = parseNodeId(edge.to);
        if (!a || !b) continue;
        const wa = nodeToWorld(a.col, a.row);
        const wb = nodeToWorld(b.col, b.row);
        positions.push(wa.x, BOARD_Y + 0.06, wa.z, wb.x, BOARD_Y + 0.06, wb.z);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      edgeLines = new THREE.LineSegments(geo, mats.edge);
      root.add(edgeLines);
    }

    const valid = state.selectedNode
      ? getValidMoves(state, state.selectedNode)
      : [];
    const selectable = getSelectableNodes(state);
    const winning = new Set(state.winningPath ?? []);

    for (const nm of nodeMeshes.values()) {
      const node = state.board.nodes.get(nm.id);
      if (!node) continue;

      let padMat = mats.space;
      if (valid.includes(nm.id)) padMat = mats.spaceValid;
      else if (state.phase === 'placement' && node.chip === null)
        padMat = mats.spaceHover;
      else if (state.selectedNode === nm.id) padMat = mats.selected;
      nm.pad.material = padMat;

      if (!node.chip) {
        clearChip(nm);
        continue;
      }

      const owner: Player = node.chip;
      const chipMat = owner === 'player1' ? mats.p1 : mats.p2;
      const { x, z } = nodeToWorld(nm.col, nm.row);

      if (!nm.chip) {
        nm.chip = new THREE.Mesh(chipGeo, chipMat);
        nm.chip.userData = { nodeId: nm.id, kind: 'chip' };
        root.add(nm.chip);
      } else {
        nm.chip.material = chipMat;
      }
      nm.chip.position.set(x, BOARD_Y + 0.1 + CHIP_H / 2, z);

      if (node.chipKind === 'marked') {
        if (!nm.dot) {
          nm.dot = new THREE.Mesh(dotGeo, mats.markedDot);
          nm.dot.userData = { nodeId: nm.id, kind: 'marked-dot' };
          root.add(nm.dot);
        }
        nm.dot.position.set(x + 0.12, BOARD_Y + 0.1 + CHIP_H + 0.02, z + 0.12);
      } else if (nm.dot) {
        root.remove(nm.dot);
        nm.dot = null;
      }

      // Subtle scale pulse for selectable / winning
      const scale = selectable.includes(nm.id) || winning.has(nm.id) ? 1.08 : 1;
      nm.chip.scale.set(scale, 1, scale);
    }

    syncA11y(state, clickHandler);
    paint();
  };

  const nodeToClientPoint = (
    nodeId: string
  ): { x: number; y: number } | null => {
    const parsed = parseNodeId(nodeId);
    if (!parsed) return null;
    const { x, z } = nodeToWorld(parsed.col, parsed.row);
    projectScratch.set(x, BOARD_Y + 0.15, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  // Test / e2e hook (also used in DEV tooling)
  window.__mp3dFiar = { nodeToClientPoint };

  const unmount = (): void => {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener('pointerup', onPointer);
    window.removeEventListener('resize', onResize);
    if (window.__mp3dFiar) {
      delete window.__mp3dFiar;
    }
    for (const nm of nodeMeshes.values()) clearChip(nm);
    nodeMeshes.clear();
    while (root.children.length > 0) root.remove(root.children[0]!);
    scene.remove(root);
    spaceGeo.dispose();
    chipGeo.dispose();
    dotGeo.dispose();
    diamondGeo.dispose();
    slabGeo.dispose();
    edgeLines?.geometry.dispose();
    Object.values(mats).forEach((m) => m.dispose());
    slabMat.dispose();
    rimMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    if (a11y.parentElement) a11y.parentElement.removeChild(a11y);
    container.classList.remove('board-3d-host', 'fiar-board-3d-host');
  };

  resize();

  void CONFIG;
  return { update, unmount, nodeToClientPoint, canvas };
}
