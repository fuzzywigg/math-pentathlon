/**
 * Three.js tilted-tabletop 3D board for Queens & Guards.
 *
 * Tablet-friendly vs Kings #352:
 * - antialias off, pixelRatio capped at 1.5
 * - render-on-demand (no continuous RAF)
 * - full-size host (no fixed 450px cap)
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 * - visually-hidden keyboard/a11y grid mirroring engine state
 *
 * Hex mesh is game-prefixed here (Hex-a-Gone builds in parallel); a shared
 * hex-mesh module is a follow-up extraction.
 */

import {
  type BoardCoord,
  type QueensGuardsState,
  CONFIG,
  cellKey,
  cellsInRing,
  parseKey,
} from '../../games/queens-guards/types';
import {
  getValidMoves,
  getRestoreTargets,
} from '../../games/queens-guards/rules';
import { getPlayerSeatColors } from '../player-colors';
import { bindCanvasPointerTap } from '../pointer-hygiene';
import { loadThree, type ThreeModule } from './load-three';
import {
  assembleGuardGroup,
  assembleQueenGroup,
  createQueensGuardsPieceGeometries,
  disposeQueensGuardsPieceGeometries,
  type QueensGuardsPieceGeometries,
} from './queens-guards-pieces';
import {
  resolveBoard3dPixelRatio,
  paintBoard3dAndMarkReady,
  scheduleBoard3dMountPaint,
  bindPageVisibility,
  shouldPreserveDrawingBuffer,
  syncBoard3dRendererSize,
  bindBoard3dLayout,
} from './tablet-gl';
import { clientToNdc } from '../coord-map';

export type CellClickCallback = (coord: BoardCoord) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type Material = InstanceType<Three['Material']>;

const HEX_R = 0.52;
const RING_STEP = HEX_R * 1.78;
const TILE_TOP_Y = 0.1;
const BOARD_Y = 0;

export interface QueensGuardsBoard3D {
  update(state: QueensGuardsState, onCellClick?: CellClickCallback): void;
  unmount(): void;
  cellToClientPoint(
    ring: number,
    position: number
  ): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

interface CellMeshes {
  ring: number;
  position: number;
  key: string;
  tile: Mesh;
  piece: Object3D | null;
}

declare global {
  interface Window {
    __mp3dQueensGuards?: {
      cellToClientPoint: (
        ring: number,
        position: number
      ) => { x: number; y: number } | null;
    };
  }
}

/** Polar layout matching 2D SVG: pos 0 at top, flat-top hexes. */
export function ringPosToWorld(
  ring: number,
  position: number
): { x: number; z: number } {
  if (ring === 0) {
    return { x: 0, z: 0 };
  }
  const count = cellsInRing(ring);
  const angle = (2 * Math.PI * position) / count - Math.PI / 2;
  const radius = ring * RING_STEP;
  return {
    x: radius * Math.cos(angle),
    z: radius * Math.sin(angle),
  };
}

function createWoodGrainTexture(
  THREE: Three
): InstanceType<Three['CanvasTexture']> {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.fillRect !== 'function') {
    return new THREE.CanvasTexture(canvas);
  }
  ctx.fillStyle = '#6b4f2e';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 48; i++) {
    const y = (i / 48) * 256 + Math.sin(i * 0.7) * 4;
    ctx.strokeStyle = i % 3 === 0 ? '#5a4124' : '#7a5a34';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 8) {
      ctx.lineTo(x, y + Math.sin(x / 18 + i) * 2.5);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createFlatTopHexShape(
  THREE: Three,
  radius: number
): InstanceType<Three['Shape']> {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
}

/**
 * Create and mount a 3D Queens & Guards board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createQueensGuardsBoard3D(
  container: HTMLElement,
  onCellClick?: CellClickCallback
): Promise<QueensGuardsBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'qg-board-3d-host');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.aspectRatio = '1';
  container.style.minHeight = 'min(360px, 72vw)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Warm wood-table atmosphere (not cool slate)
  scene.background = new THREE.Color(0x2a2118);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  // Tilted tabletop — full hex board in frame on phone + tablet
  camera.position.set(0, 11.4, 10.2);
  camera.lookAt(0, 0, 0.15);

  let renderer: InstanceType<Three['WebGLRenderer']>;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
      // Only when Playwright needs canvas.screenshot() / explicit opt-in.
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
      `WebGLRenderer failed — Queens & Guards 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(resolveBoard3dPixelRatio());
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'queens-guards');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Queens and Guards 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  // Visually-hidden a11y grid (keyboard / screen reader)
  const a11y = document.createElement('div');
  a11y.className = 'qg-a11y-grid';
  a11y.setAttribute('role', 'grid');
  a11y.setAttribute('aria-label', 'Queens and Guards board spaces');
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  container.appendChild(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.48);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xf5e6c8, 0x2a1f14, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff4e0, 0.8);
  key.position.set(5, 14, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  // Warm wood tabletop (procedural grain; not slate)
  const boardRadius = (CONFIG.NUM_RINGS - 1) * RING_STEP + HEX_R + 0.55;
  const slabGeo = new THREE.CylinderGeometry(
    boardRadius,
    boardRadius + 0.15,
    0.22,
    48
  );
  const woodMap = createWoodGrainTexture(THREE);
  const slabMat = new THREE.MeshLambertMaterial({
    color: 0x8b6239,
    map: woodMap,
  });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = BOARD_Y - 0.14;
  root.add(slab);

  const rimMat = new THREE.MeshLambertMaterial({ color: 0x3e2a16 });
  const rimGeo = new THREE.TorusGeometry(boardRadius + 0.08, 0.08, 8, 48);
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = BOARD_Y - 0.02;
  root.add(rim);

  const seats = getPlayerSeatColors();
  const p1Color = new THREE.Color(seats.player1);
  const p2Color = new THREE.Color(seats.player2);

  const mats = {
    light: new THREE.MeshLambertMaterial({ color: 0xe8dcc0 }),
    dark: new THREE.MeshLambertMaterial({ color: 0xc9b896 }),
    center: new THREE.MeshLambertMaterial({ color: 0xffd54f }),
    ring1: new THREE.MeshLambertMaterial({ color: 0xffe082 }),
    selected: new THREE.MeshLambertMaterial({ color: 0xff9800 }),
    valid: new THREE.MeshLambertMaterial({ color: 0x66bb6a }),
    capture: new THREE.MeshLambertMaterial({ color: 0xe53935 }),
    last: new THREE.MeshLambertMaterial({ color: 0x64b5f6 }),
    focus: new THREE.MeshLambertMaterial({ color: 0xce93d8 }),
    // Subtle gold for the winning formation — static, no pulse
    winner: new THREE.MeshLambertMaterial({ color: 0xd4b45a }),
    p1: new THREE.MeshLambertMaterial({
      color: p1Color.clone().multiplyScalar(0.9),
    }),
    p2: new THREE.MeshLambertMaterial({
      color: p2Color.clone().multiplyScalar(0.9),
    }),
    queenGlow: new THREE.MeshLambertMaterial({ color: 0xd4af37 }),
  };

  const hexShape = createFlatTopHexShape(THREE, HEX_R * 0.92);
  const tileGeo = new THREE.ExtrudeGeometry(hexShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
  });
  // Extrude along +Z by default; lay flat on XZ
  tileGeo.rotateX(-Math.PI / 2);

  const pieceGeos: QueensGuardsPieceGeometries =
    createQueensGuardsPieceGeometries(THREE);
  const queenGlowGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16);

  const cells: CellMeshes[] = [];
  for (let ring = 0; ring < CONFIG.NUM_RINGS; ring++) {
    const count = cellsInRing(ring);
    for (let position = 0; position < count; position++) {
      let baseMat: Material = ring % 2 === 0 ? mats.light : mats.dark;
      if (ring === 0) {
        baseMat = mats.center;
      } else if (ring === 1) {
        baseMat = mats.ring1;
      }

      const tile = new THREE.Mesh(tileGeo, baseMat);
      const { x, z } = ringPosToWorld(ring, position);
      tile.position.set(x, BOARD_Y, z);
      tile.userData = { ring, position, kind: 'tile' };
      root.add(tile);
      cells.push({
        ring,
        position,
        key: cellKey(ring, position),
        tile,
        piece: null,
      });
    }
  }

  let clickHandler: CellClickCallback | undefined = onCellClick;
  let disposed = false;
  let focusedKey: string | null = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projectScratch = new THREE.Vector3();

  const paint = (): void => {
    paintBoard3dAndMarkReady(
      canvas,
      () => renderer.render(scene, camera),
      () => disposed
    );
  };

  const resize = (): void => {
    if (disposed) {
      return;
    }
    const w = Math.max(container.clientWidth || 480, 120);
    const h = Math.max(container.clientHeight || 480, 120);
    syncBoard3dRendererSize(renderer, camera, w, h);
    paint();
  };

  /** Prefer raycast; fall back to nearest hex center in screen space (tablet tilt). */
  const pickCoord = (clientX: number, clientY: number): BoardCoord | null => {
    const rect = canvas.getBoundingClientRect();
    const ndc = clientToNdc(clientX, clientY, rect);
    if (!ndc) {
      return null;
    }
    pointer.x = ndc.x;
    pointer.y = ndc.y;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const data = obj.userData as { ring?: number; position?: number };
        if (
          typeof data.ring === 'number' &&
          typeof data.position === 'number'
        ) {
          return { ring: data.ring, position: data.position };
        }
        obj = obj.parent;
      }
    }

    let best: BoardCoord | null = null;
    let bestDist = Infinity;
    for (const cell of cells) {
      const { x, z } = ringPosToWorld(cell.ring, cell.position);
      projectScratch.set(x, TILE_TOP_Y, z).project(camera);
      const sx = rect.left + ((projectScratch.x + 1) / 2) * rect.width;
      const sy = rect.top + ((-projectScratch.y + 1) / 2) * rect.height;
      const dx = sx - clientX;
      const dy = sy - clientY;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = { ring: cell.ring, position: cell.position };
      }
    }
    // ~half a hex in CSS pixels at typical phone width
    const maxDist = Math.max(rect.width, rect.height) * 0.08;
    if (best && bestDist <= maxDist * maxDist) {
      return best;
    }
    return null;
  };

  const onPointer = (event: PointerEvent): void => {
    if (!clickHandler || disposed) {
      return;
    }
    const coord = pickCoord(event.clientX, event.clientY);
    if (coord) {
      clickHandler(coord);
    }
  };

  let tearDown: (() => void) | null = null;

  const onContextLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) {
      return;
    }
    tearDown?.();
    container.dispatchEvent(new CustomEvent('mp3d-context-lost'));
  };

  const unbindVisibility = bindPageVisibility({
    onVisible: () => paint(),
  });
  const unbindPointer = bindCanvasPointerTap(canvas, {
    onTap: onPointer,
  });
  canvas.addEventListener('webglcontextlost', onContextLost);
  const unbindLayout = bindBoard3dLayout(container, () => resize());

  const onA11yFocusIn = (event: FocusEvent): void => {
    const t = event.target as HTMLElement | null;
    if (!t || !a11y.contains(t)) {
      return;
    }
    const ring = Number(t.getAttribute('data-row'));
    const position = Number(t.getAttribute('data-col'));
    if (Number.isFinite(ring) && Number.isFinite(position)) {
      focusedKey = cellKey(ring, position);
      // Re-paint focus highlight without waiting for next game update
      paintFocusOnly();
    }
  };
  a11y.addEventListener('focusin', onA11yFocusIn);

  let lastState: QueensGuardsState | null = null;

  const paintFocusOnly = (): void => {
    if (!lastState || disposed) {
      return;
    }
    applyTileMaterials(lastState);
    paint();
  };

  const clearPiece = (cell: CellMeshes): void => {
    if (!cell.piece) {
      return;
    }
    root.remove(cell.piece);
    cell.piece = null;
  };

  const syncPiece = (cell: CellMeshes, state: QueensGuardsState): void => {
    const boardCell = state.cells.get(cell.key);
    const piece = boardCell?.piece ?? null;
    const existing = cell.piece;
    const existingKind = existing?.userData?.kind as string | undefined;
    const existingOwner = existing?.userData?.owner as string | undefined;

    if (!piece) {
      clearPiece(cell);
      return;
    }

    const { x, z } = ringPosToWorld(cell.ring, cell.position);
    const mat = piece.player === 'player1' ? mats.p1 : mats.p2;

    if (
      existing &&
      existingKind === piece.type &&
      existingOwner === piece.player
    ) {
      existing.position.set(x, TILE_TOP_Y, z);
      existing.userData = {
        ...existing.userData,
        ring: cell.ring,
        position: cell.position,
        kind: piece.type,
        owner: piece.player,
      };
      return;
    }

    clearPiece(cell);
    if (piece.type === 'queen') {
      const group = assembleQueenGroup(
        THREE,
        pieceGeos,
        mat,
        cell.ring,
        cell.position,
        piece.player
      );
      // Subtle gold base under queen so it reads as royalty on tablet
      const glow = new THREE.Mesh(queenGlowGeo as never, mats.queenGlow);
      glow.position.y = 0.015;
      glow.userData = {
        ring: cell.ring,
        position: cell.position,
        kind: 'glow',
      };
      group.add(glow);
      group.position.set(x, TILE_TOP_Y, z);
      root.add(group);
      cell.piece = group;
      return;
    }

    const group = assembleGuardGroup(
      THREE,
      pieceGeos,
      mat,
      cell.ring,
      cell.position,
      piece.player
    );
    group.position.set(x, TILE_TOP_Y, z);
    root.add(group);
    cell.piece = group;
  };

  const applyTileMaterials = (state: QueensGuardsState): void => {
    const restoring = state.capturedPieces.length > 0;
    const validMoves = new Set<string>();
    if (restoring) {
      for (const m of getRestoreTargets(state)) {
        validMoves.add(cellKey(m.ring, m.position));
      }
    } else if (state.selectedPiece) {
      const selectedCoord = parseKey(state.selectedPiece);
      for (const m of getValidMoves(state, selectedCoord)) {
        validMoves.add(cellKey(m.ring, m.position));
      }
    }

    const lastEntry =
      state.moveHistory.length > 0
        ? state.moveHistory[state.moveHistory.length - 1]
        : undefined;
    const last = lastEntry ?? null;
    const lastFrom = last ? cellKey(last.from.ring, last.from.position) : null;
    const lastTo = last ? cellKey(last.to.ring, last.to.position) : null;
    const lastWasCapture = Boolean(last?.wasCapture);

    const captured = new Set(
      state.capturedPieces.map((c) => cellKey(c.ring, c.position))
    );

    const winnerThrone =
      Boolean(state.winner) &&
      state.cells.get(cellKey(0, 0))?.piece?.player === state.winner;

    for (const cell of cells) {
      let baseMat: Material = cell.ring % 2 === 0 ? mats.light : mats.dark;
      if (cell.ring === 0) {
        baseMat = mats.center;
      } else if (cell.ring === 1) {
        baseMat = mats.ring1;
      }

      let tileMat = baseMat;
      if (state.selectedPiece === cell.key) {
        tileMat = mats.selected;
      } else if (validMoves.has(cell.key)) {
        tileMat = mats.valid;
      } else if (captured.has(cell.key)) {
        tileMat = mats.capture;
      } else if (lastWasCapture && lastTo === cell.key) {
        tileMat = mats.capture;
      } else if (lastFrom === cell.key || lastTo === cell.key) {
        tileMat = mats.last;
      } else if (focusedKey === cell.key) {
        tileMat = mats.focus;
      }

      if (winnerThrone && (cell.ring === 0 || cell.ring === 1)) {
        const owner = state.cells.get(cell.key)?.piece?.player;
        if (owner === state.winner) {
          tileMat = mats.winner;
        }
      }

      cell.tile.material = tileMat;
    }
  };

  const syncA11y = (
    state: QueensGuardsState,
    handler?: CellClickCallback
  ): void => {
    a11y.replaceChildren();
    const restoring = state.capturedPieces.length > 0;
    const validMoves = new Set<string>();
    if (restoring) {
      for (const m of getRestoreTargets(state)) {
        validMoves.add(cellKey(m.ring, m.position));
      }
    } else if (state.selectedPiece) {
      const selectedCoord = parseKey(state.selectedPiece);
      for (const m of getValidMoves(state, selectedCoord)) {
        validMoves.add(cellKey(m.ring, m.position));
      }
    }

    const captured = new Set(
      state.capturedPieces.map((c) => cellKey(c.ring, c.position))
    );

    for (const cell of cells) {
      const boardCell = state.cells.get(cell.key);
      const piece = boardCell?.piece ?? null;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('data-cell-key', cell.key);
      btn.setAttribute('data-row', String(cell.ring));
      btn.setAttribute('data-col', String(cell.position));
      const owner =
        piece?.player === 'player1'
          ? 'Blue'
          : piece?.player === 'player2'
            ? 'Red'
            : 'empty';
      const pieceName =
        piece?.type === 'queen'
          ? 'Queen'
          : piece?.type === 'guard'
            ? 'Guard'
            : '';
      const extras: string[] = [];
      if (state.selectedPiece === cell.key) {
        extras.push('selected');
      }
      if (validMoves.has(cell.key)) {
        extras.push(restoring ? 'restore target' : 'legal move');
      }
      if (captured.has(cell.key)) {
        extras.push('captured');
      }
      btn.setAttribute(
        'aria-label',
        `ring ${cell.ring} pos ${cell.position}, ${owner}${
          pieceName ? ` ${pieceName}` : ''
        }${extras.length ? `, ${extras.join(', ')}` : ''}`
      );

      const cellPiece = piece;
      const selectable = restoring
        ? captured.has(cell.key)
        : cellPiece?.player === state.currentPlayer && !state.winner;
      btn.tabIndex =
        selectable ||
        validMoves.has(cell.key) ||
        state.selectedPiece === cell.key
          ? 0
          : -1;

      btn.addEventListener('click', () =>
        handler?.({ ring: cell.ring, position: cell.position })
      );
      btn.addEventListener('focus', () => {
        focusedKey = cell.key;
        if (lastState) {
          applyTileMaterials(lastState);
          paint();
        }
      });
      a11y.appendChild(btn);
    }

    if (!a11y.querySelector('[tabindex="0"]')) {
      const first = a11y.querySelector('button');
      if (first) {
        first.tabIndex = 0;
      }
    }
  };

  const update = (
    state: QueensGuardsState,
    nextClick?: CellClickCallback
  ): void => {
    if (disposed) {
      return;
    }
    clickHandler = nextClick;
    lastState = state;

    applyTileMaterials(state);
    for (const cell of cells) {
      syncPiece(cell, state);
    }
    syncA11y(state, clickHandler);
    paint();
  };

  const cellToClientPoint = (
    ring: number,
    position: number
  ): { x: number; y: number } | null => {
    if (ring < 0 || ring >= CONFIG.NUM_RINGS) {
      return null;
    }
    if (position < 0 || position >= cellsInRing(ring)) {
      return null;
    }
    const { x, z } = ringPosToWorld(ring, position);
    projectScratch.set(x, TILE_TOP_Y, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  window.__mp3dQueensGuards = { cellToClientPoint };

  let cancelMountPaint: () => void = () => undefined;
  const unmount = (): void => {
    if (disposed) {
      return;
    }
    disposed = true;
    cancelMountPaint();
    unbindPointer();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    unbindLayout();
    unbindVisibility();
    a11y.removeEventListener('focusin', onA11yFocusIn);
    if (window.__mp3dQueensGuards) {
      delete window.__mp3dQueensGuards;
    }

    for (const cell of cells) {
      clearPiece(cell);
    }
    while (root.children.length > 0) {
      const child = root.children[0];
      if (child === undefined) {
        break;
      }
      root.remove(child);
    }
    scene.remove(root);

    tileGeo.dispose();
    slabGeo.dispose();
    rimGeo.dispose();
    queenGlowGeo.dispose();
    woodMap.dispose();
    disposeQueensGuardsPieceGeometries(pieceGeos);
    Object.values(mats).forEach((m) => m.dispose());
    slabMat.dispose();
    rimMat.dispose();

    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
    if (a11y.parentElement) {
      a11y.parentElement.removeChild(a11y);
    }
    container.classList.remove('board-3d-host', 'qg-board-3d-host');
  };

  tearDown = unmount;
  resize();
  cancelMountPaint = scheduleBoard3dMountPaint(paint);

  return { update, unmount, cellToClientPoint, canvas };
}
