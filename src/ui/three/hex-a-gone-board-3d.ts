/**
 * Three.js tilted-tabletop 3D board for Hex-a-Gone!
 *
 * Tablet-friendly vs Kings #352:
 * - antialias off, pixelRatio capped at TABLET_PIXEL_RATIO_CAP
 * - preserveDrawingBuffer gated; pause paints while the tab is hidden
 * - render-on-demand (no continuous RAF)
 * - full-size host
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 * - visually-hidden a11y grid mirrors state / keyboard (PR #353 Space/Enter)
 */

import type {
  BlockShape,
  HexAGoneGameState,
} from '../../games/hex-a-gone/types';
import { BLOCK_COLORS } from '../../games/hex-a-gone/types';
import { getValidPlacements } from '../../games/hex-a-gone/rules';
import { getPlayerSeatColors } from '../player-colors';
import { loadThree, type ThreeModule } from './load-three';
import {
  resolveBoard3dPixelRatio,
  markBoard3dCanvasReady,
  bindPageVisibility,
  canPaint3d,
  shouldPreserveDrawingBuffer,
} from './tablet-gl';
import {
  createHexAGonePieceGeometries,
  disposeHexAGonePieceGeometries,
  geometryForShape,
  PIECE_HEIGHT,
  type HexAGonePieceGeometries,
} from './hex-a-gone-pieces';

export type CellClickCallback = (q: number, r: number) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type Material = InstanceType<Three['MeshLambertMaterial']>;

const HEX_SIZE = 0.95;
const TILE_H = 0.1;
const BOARD_Y = 0;

export interface HexAGoneBoard3D {
  update(state: HexAGoneGameState, onCellClick?: CellClickCallback): void;
  unmount(): void;
  cellToClientPoint(q: number, r: number): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __mp3dHexAGone?: {
      cellToClientPoint: (
        q: number,
        r: number
      ) => { x: number; y: number } | null;
    };
  }
}

/** Flat-top axial → world XZ (Y up). */
export function axialToWorld(q: number, r: number): { x: number; z: number } {
  const x = HEX_SIZE * ((3 / 2) * q);
  const z = HEX_SIZE * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return { x, z };
}

function parseHexColor(hex: string): number {
  const cleaned = hex.replace('#', '');
  return Number.parseInt(cleaned, 16);
}

/**
 * Create and mount a 3D Hex-a-Gone board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createHexAGoneBoard3D(
  container: HTMLElement,
  onCellClick?: CellClickCallback,
  onWebglLost?: () => void
): Promise<HexAGoneBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'hex-a-gone-board-3d-host');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  // Keep bank/confirm chrome on-screen: board fills width but caps height
  container.style.aspectRatio = '1 / 0.9';
  container.style.maxHeight = 'min(48vh, 440px)';
  container.style.minHeight = 'min(220px, 58vw)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Soft classroom tabletop atmosphere (original procedural look)
  scene.background = new THREE.Color(0x1b2a33);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  // Steeper tabletop tilt so empty boards still read as 3D on phones
  camera.position.set(0, 10.2, 13.5);
  camera.lookAt(0, 0, 0.2);

  let renderer: InstanceType<Three['WebGLRenderer']>;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: shouldPreserveDrawingBuffer(),
    });
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
      `WebGLRenderer failed — Hex-a-Gone 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(resolveBoard3dPixelRatio());
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'hex-a-gone');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Hex-a-Gone 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  const a11y = document.createElement('div');
  a11y.className = 'hex-a-gone-a11y-grid';
  a11y.setAttribute('role', 'grid');
  a11y.setAttribute('aria-label', 'Hex-a-Gone board spaces');
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  container.appendChild(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xfff4e0, 0x2a1a10, 0.5);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(5, 14, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  // Wooden tabletop slab under the hex field
  const slabGeo = new THREE.CylinderGeometry(6.4, 6.6, 0.22, 6);
  const slabMat = new THREE.MeshLambertMaterial({ color: 0x6b4f32 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.rotation.y = Math.PI / 6;
  slab.position.y = BOARD_Y - 0.18;
  root.add(slab);

  const feltGeo = new THREE.CylinderGeometry(5.85, 5.85, 0.04, 6);
  const feltMat = new THREE.MeshLambertMaterial({ color: 0x2d5a3d });
  const felt = new THREE.Mesh(feltGeo, feltMat);
  felt.rotation.y = Math.PI / 6;
  felt.position.y = BOARD_Y - 0.05;
  root.add(felt);

  const seats = getPlayerSeatColors();
  const mats = {
    empty: new THREE.MeshLambertMaterial({ color: 0xe8dcc8 }),
    valid: new THREE.MeshLambertMaterial({ color: 0x8fd18f }),
    hover: new THREE.MeshLambertMaterial({ color: 0xffe082 }),
    focus: new THREE.MeshLambertMaterial({ color: 0xffcc80 }),
    last: new THREE.MeshLambertMaterial({ color: 0x81d4fa }),
    win: new THREE.MeshLambertMaterial({ color: 0xffd54f }),
    ghost: new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
    }),
    seatRingP1: new THREE.MeshLambertMaterial({ color: seats.player1 }),
    seatRingP2: new THREE.MeshLambertMaterial({ color: seats.player2 }),
  };

  const shapeMats = {} as Record<BlockShape, Material>;
  (Object.keys(BLOCK_COLORS) as BlockShape[]).forEach((shape) => {
    shapeMats[shape] = new THREE.MeshLambertMaterial({
      color: parseHexColor(BLOCK_COLORS[shape]),
    });
  });

  const tileGeo = new THREE.CylinderGeometry(
    HEX_SIZE * 0.52,
    HEX_SIZE * 0.52,
    TILE_H,
    6
  );
  const ringGeo = new THREE.TorusGeometry(HEX_SIZE * 0.38, 0.03, 6, 24);
  const pieceGeos: HexAGonePieceGeometries =
    createHexAGonePieceGeometries(THREE);

  interface CellMeshes {
    q: number;
    r: number;
    tile: Mesh;
    piece: Mesh | null;
    ring: Mesh | null;
  }

  const cellMeshes = new Map<string, CellMeshes>();
  let clickHandler: CellClickCallback | undefined = onCellClick;
  let disposed = false;
  let hoverKey: string | null = null;
  let focusKey: string | null = null;
  let ghost: Mesh | null = null;
  let lastState: HexAGoneGameState | null = null;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projectScratch = new THREE.Vector3();

  const paint = (): void => {
    if (disposed || !canPaint3d()) return;
    renderer.render(scene, camera);
    markBoard3dCanvasReady(canvas);
  };

  const resize = (): void => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 480, 120);
    const h = Math.max(container.clientHeight || 480, 120);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    paint();
  };

  const cellKey = (q: number, r: number): string => `${q},${r}`;

  const clearPiece = (cm: CellMeshes): void => {
    if (cm.piece) {
      root.remove(cm.piece);
      cm.piece = null;
    }
    if (cm.ring) {
      root.remove(cm.ring);
      cm.ring = null;
    }
  };

  const clearGhost = (): void => {
    if (ghost) {
      root.remove(ghost);
      ghost = null;
    }
  };

  const pickCellFromEvent = (
    event: PointerEvent
  ): { q: number; r: number } | null => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const q = obj.userData?.q as number | undefined;
        const r = obj.userData?.r as number | undefined;
        if (typeof q === 'number' && typeof r === 'number') {
          return { q, r };
        }
        obj = obj.parent;
      }
    }
    return null;
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (!clickHandler || disposed) return;
    const cell = pickCellFromEvent(event);
    if (cell) clickHandler(cell.q, cell.r);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (disposed || !lastState) return;
    if (lastState.phase !== 'placeBlocks') {
      if (hoverKey) {
        hoverKey = null;
        syncVisuals(lastState);
      }
      return;
    }
    const cell = pickCellFromEvent(event);
    const next = cell ? cellKey(cell.q, cell.r) : null;
    if (next === hoverKey) return;
    hoverKey = next;
    syncVisuals(lastState);
  };

  const onPointerLeave = (): void => {
    if (!hoverKey || !lastState) return;
    hoverKey = null;
    syncVisuals(lastState);
  };

  const onContextLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) return;
    disposed = true;
    onWebglLost?.();
  };

  const onResize = (): void => resize();
  const unbindVisibility = bindPageVisibility({
    onVisible: () => paint(),
  });
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextlost', onContextLost);
  window.addEventListener('resize', onResize);

  const syncA11y = (
    state: HexAGoneGameState,
    handler?: CellClickCallback
  ): void => {
    a11y.replaceChildren();
    const valid =
      state.phase === 'placeBlocks' ? getValidPlacements(state) : [];
    const validSet = new Set(valid.map((p) => cellKey(p.q, p.r)));

    for (const cell of state.board) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('data-q', String(cell.q));
      btn.setAttribute('data-r', String(cell.r));
      btn.setAttribute('data-row', String(cell.r));
      btn.setAttribute('data-col', String(cell.q));
      const owner =
        cell.filledBy === 'player1'
          ? 'Blue'
          : cell.filledBy === 'player2'
            ? 'Red'
            : 'empty';
      btn.setAttribute('aria-label', `${cell.q},${cell.r}, ${owner}`);
      const isValid = !cell.filled && validSet.has(cellKey(cell.q, cell.r));
      btn.tabIndex = isValid && handler ? 0 : -1;
      btn.addEventListener('click', () => handler?.(cell.q, cell.r));
      btn.addEventListener('focus', () => {
        focusKey = cellKey(cell.q, cell.r);
        if (lastState) syncVisuals(lastState);
      });
      btn.addEventListener('blur', () => {
        if (focusKey === cellKey(cell.q, cell.r)) {
          focusKey = null;
          if (lastState) syncVisuals(lastState);
        }
      });
      // Space / Enter place (PR #353 behaviour) via native button activation
      a11y.appendChild(btn);
    }
    if (!a11y.querySelector('[tabindex="0"]')) {
      const first = a11y.querySelector('button');
      if (first) first.tabIndex = 0;
    }
  };

  const ensureCells = (state: HexAGoneGameState): void => {
    if (cellMeshes.size > 0) return;
    for (const cell of state.board) {
      const { x, z } = axialToWorld(cell.q, cell.r);
      const tile = new THREE.Mesh(tileGeo, mats.empty);
      tile.rotation.y = Math.PI / 6; // flat-top hex
      tile.position.set(x, BOARD_Y + TILE_H / 2, z);
      tile.userData = { q: cell.q, r: cell.r, kind: 'tile' };
      root.add(tile);
      cellMeshes.set(cellKey(cell.q, cell.r), {
        q: cell.q,
        r: cell.r,
        tile,
        piece: null,
        ring: null,
      });
    }
  };

  const syncGhost = (state: HexAGoneGameState): void => {
    clearGhost();
    if (state.phase !== 'placeBlocks' || !state.selectedBlockForPlacement) {
      return;
    }
    const activeKey = hoverKey ?? focusKey;
    if (!activeKey) return;
    const valid = getValidPlacements(state);
    const validSet = new Set(valid.map((p) => cellKey(p.q, p.r)));
    if (!validSet.has(activeKey)) return;
    const [qs, rs] = activeKey.split(',').map(Number) as [number, number];
    const { x, z } = axialToWorld(qs, rs);
    const shape = state.selectedBlockForPlacement;
    mats.ghost.color.set(parseHexColor(BLOCK_COLORS[shape]));
    ghost = new THREE.Mesh(geometryForShape(pieceGeos, shape), mats.ghost);
    // Extrude along Z → lay flat on table (Y up)
    ghost.rotation.x = -Math.PI / 2;
    ghost.position.set(x, BOARD_Y + TILE_H + 0.02, z);
    ghost.userData = { q: qs, r: rs, kind: 'ghost' };
    root.add(ghost);
  };

  const syncVisuals = (state: HexAGoneGameState): void => {
    ensureCells(state);
    const valid =
      state.phase === 'placeBlocks' ? getValidPlacements(state) : [];
    const validSet = new Set(valid.map((p) => cellKey(p.q, p.r)));
    const lastBlock = state.placedBlocks[state.placedBlocks.length - 1];
    const lastKey = lastBlock ? cellKey(lastBlock.q, lastBlock.r) : null;

    for (const cm of cellMeshes.values()) {
      const key = cellKey(cm.q, cm.r);
      const cell = state.board.find((c) => c.q === cm.q && c.r === cm.r);
      if (!cell) continue;

      let tileMat: Material = mats.empty;
      if (state.phase === 'gameOver' && cell.filledBy === state.winner) {
        tileMat = mats.win;
      } else if (key === lastKey) {
        tileMat = mats.last;
      } else if (key === focusKey) {
        tileMat = mats.focus;
      } else if (key === hoverKey && validSet.has(key)) {
        tileMat = mats.hover;
      } else if (validSet.has(key)) {
        tileMat = mats.valid;
      }
      cm.tile.material = tileMat;

      if (!cell.filled) {
        clearPiece(cm);
        continue;
      }

      const block = state.placedBlocks.find(
        (b) => b.q === cm.q && b.r === cm.r
      );
      if (!block) {
        clearPiece(cm);
        continue;
      }

      const { x, z } = axialToWorld(cm.q, cm.r);
      const pieceMat = shapeMats[block.shape];
      if (!cm.piece) {
        cm.piece = new THREE.Mesh(
          geometryForShape(pieceGeos, block.shape),
          pieceMat
        );
        cm.piece.rotation.x = -Math.PI / 2;
        cm.piece.userData = { q: cm.q, r: cm.r, kind: 'piece' };
        root.add(cm.piece);
      } else {
        cm.piece.material = pieceMat;
        cm.piece.geometry = geometryForShape(pieceGeos, block.shape);
      }
      cm.piece.position.set(x, BOARD_Y + TILE_H + 0.01, z);

      const ringMat =
        block.player === 'player1' ? mats.seatRingP1 : mats.seatRingP2;
      if (!cm.ring) {
        cm.ring = new THREE.Mesh(ringGeo, ringMat);
        cm.ring.rotation.x = Math.PI / 2;
        cm.ring.userData = { q: cm.q, r: cm.r, kind: 'ring' };
        root.add(cm.ring);
      } else {
        cm.ring.material = ringMat;
      }
      cm.ring.position.set(x, BOARD_Y + TILE_H + PIECE_HEIGHT + 0.04, z);
    }

    syncGhost(state);
    paint();
  };

  const update = (
    state: HexAGoneGameState,
    nextClick?: CellClickCallback
  ): void => {
    if (disposed) return;
    clickHandler = nextClick;
    lastState = state;
    syncVisuals(state);
    syncA11y(state, clickHandler);
  };

  const cellToClientPoint = (
    q: number,
    r: number
  ): { x: number; y: number } | null => {
    const { x, z } = axialToWorld(q, r);
    projectScratch.set(x, BOARD_Y + TILE_H + 0.15, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  window.__mp3dHexAGone = { cellToClientPoint };

  const unmount = (): void => {
    if (disposed) return;
    disposed = true;
    unbindVisibility();
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    window.removeEventListener('resize', onResize);
    if (window.__mp3dHexAGone) {
      delete window.__mp3dHexAGone;
    }
    clearGhost();
    for (const cm of cellMeshes.values()) clearPiece(cm);
    cellMeshes.clear();
    while (root.children.length > 0) root.remove(root.children[0]!);
    scene.remove(root);
    tileGeo.dispose();
    ringGeo.dispose();
    slabGeo.dispose();
    feltGeo.dispose();
    disposeHexAGonePieceGeometries(pieceGeos);
    Object.values(mats).forEach((m) => m.dispose());
    Object.values(shapeMats).forEach((m) => m.dispose());
    slabMat.dispose();
    feltMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    if (a11y.parentElement) a11y.parentElement.removeChild(a11y);
    container.classList.remove('board-3d-host', 'hex-a-gone-board-3d-host');
  };

  resize();

  return { update, unmount, cellToClientPoint, canvas };
}
