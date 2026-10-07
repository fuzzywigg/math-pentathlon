/**
 * Three.js tilted-tabletop 3D board for Pent'Em In.
 *
 * Tablet-friendly vs Kings #352 (aligned with FIAR draft patterns):
 * - antialias off, pixelRatio capped at TABLET_PIXEL_RATIO_CAP
 * - preserveDrawingBuffer gated; pause paints while the tab is hidden
 * - render-on-demand (no continuous RAF)
 * - full-size host (no fixed 450px cap)
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 * - visually hidden a11y grid for keyboard / screen readers
 */

import type { Cell } from '../../core/polyomino/types';
import type { PentEmInState, Player } from '../../games/pent-em-in/types';
import { BOARD_SIZE } from '../../games/pent-em-in/types';
import {
  canPlacePiece,
  getPieceCells,
  getValidPlacements,
} from '../../games/pent-em-in/rules';
import { getPlayerSeatColors } from '../player-colors';
import {
  applyRovingTabindex,
  bindCellActivateKeys,
  bindGridNavigation,
  buildCellAriaLabel,
  captureFocusedCell,
  collectGridCells,
  makeGridCell,
  markBoardAsGrid,
  restoreGridFocus,
} from '../board-a11y';
import { loadThree, type ThreeModule } from './load-three';
import {
  TABLET_PIXEL_RATIO_CAP,
  bindPageVisibility,
  canPaint3d,
  shouldPreserveDrawingBuffer,
} from './tablet-gl';

export type CellClickCallback = (cell: Cell) => void;
export type CellHoverCallback = (cell: Cell | null) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type Material = InstanceType<Three['MeshLambertMaterial']>;

const CELL = 1;
const GAP = 0.08;
const STEP = CELL + GAP;
const TILE_H = 0.14;
const BLOCK_H = 0.32;
const BEVEL_H = 0.05;
const BLOCK_XY = CELL - 0.14;
const BEVEL_XY = BLOCK_XY - 0.1;

export interface PentEmInBoard3D {
  update(
    state: PentEmInState,
    onCellClick?: CellClickCallback,
    onCellHover?: CellHoverCallback
  ): void;
  unmount(): void;
  cellToClientPoint(row: number, col: number): { x: number; y: number };
  readonly canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __mp3dPentEmIn?: {
      cellToClientPoint: (row: number, col: number) => { x: number; y: number };
    };
  }
}

function boardToWorld(row: number, col: number): { x: number; z: number } {
  const origin = -((BOARD_SIZE - 1) * STEP) / 2;
  return {
    x: origin + col * STEP,
    z: origin + row * STEP,
  };
}

interface TileMeshes {
  tile: Mesh;
  row: number;
  col: number;
}

/**
 * Create and mount a 3D Pent'Em In board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createPentEmInBoard3D(
  container: HTMLElement,
  onCellClick?: CellClickCallback,
  onCellHover?: CellHoverCallback
): Promise<PentEmInBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'pent-board-3d-host');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.aspectRatio = '1';
  container.style.minHeight = 'min(360px, 72vw)';
  container.style.maxHeight = 'min(72vh, 720px)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Soft tabletop atmosphere (original procedural look — not kit photos)
  scene.background = new THREE.Color(0x1c2430);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 13.2, 12.4);
  camera.lookAt(0, 0, 0.15);

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
      `WebGLRenderer failed — Pent'Em In 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, TABLET_PIXEL_RATIO_CAP)
  );
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'pent-em-in');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', "Pent'Em In 3D board");
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  const a11y = document.createElement('div');
  a11y.className = 'pent-a11y-grid';
  markBoardAsGrid(a11y);
  a11y.setAttribute('aria-label', "Pent'Em In board spaces");
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  container.appendChild(a11y);
  bindGridNavigation(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xf0f4ff, 0x2a2118, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff8e7, 0.8);
  key.position.set(5, 14, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  const boardSpan = BOARD_SIZE * STEP + 0.55;
  const slabGeo = new THREE.BoxGeometry(boardSpan, 0.2, boardSpan);
  const slabMat = new THREE.MeshLambertMaterial({ color: 0x2a3344 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = -0.12;
  root.add(slab);

  const seats = getPlayerSeatColors();
  const mats = {
    light: new THREE.MeshLambertMaterial({ color: 0xe8dcc8 }),
    dark: new THREE.MeshLambertMaterial({ color: 0xc4b49a }),
    valid: new THREE.MeshLambertMaterial({ color: 0x81c784 }),
    focus: new THREE.MeshLambertMaterial({ color: 0xffe082 }),
    last: new THREE.MeshLambertMaterial({ color: 0x80deea }),
    p1: new THREE.MeshLambertMaterial({ color: seats.player1 }),
    p2: new THREE.MeshLambertMaterial({ color: seats.player2 }),
    p1Win: new THREE.MeshLambertMaterial({
      color: seats.player1,
      emissive: seats.player1,
      emissiveIntensity: 0.22,
    }),
    p2Win: new THREE.MeshLambertMaterial({
      color: seats.player2,
      emissive: seats.player2,
      emissiveIntensity: 0.22,
    }),
    ghostOk: new THREE.MeshLambertMaterial({
      color: seats.player1,
      transparent: true,
      opacity: 0.45,
    }),
    ghostBad: new THREE.MeshLambertMaterial({
      color: 0xff5252,
      transparent: true,
      opacity: 0.5,
    }),
  };

  const tileGeo = new THREE.BoxGeometry(CELL, TILE_H, CELL);
  const blockGeo = new THREE.BoxGeometry(BLOCK_XY, BLOCK_H, BLOCK_XY);
  const bevelGeo = new THREE.BoxGeometry(BEVEL_XY, BEVEL_H, BEVEL_XY);

  const tiles: TileMeshes[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const isLight = (row + col) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isLight ? mats.light : mats.dark);
      const { x, z } = boardToWorld(row, col);
      tile.position.set(x, 0, z);
      tile.userData = { row, col, kind: 'tile' };
      root.add(tile);
      tiles.push({ tile, row, col });
    }
  }

  let clickHandler: CellClickCallback | undefined = onCellClick;
  let hoverHandler: CellHoverCallback | undefined = onCellHover;
  let disposed = false;
  let focusedCell: Cell | null = null;
  const pieceRoot: Object3D = new THREE.Group();
  pieceRoot.userData = { kind: 'pieces' };
  root.add(pieceRoot);
  const ghostRoot: Object3D = new THREE.Group();
  ghostRoot.userData = { kind: 'ghost' };
  root.add(ghostRoot);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projectScratch = new THREE.Vector3();

  const paint = (): void => {
    if (disposed || !canPaint3d()) return;
    renderer.render(scene, camera);
  };

  const resize = (): void => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 400, 120);
    const h = Math.max(container.clientHeight || 400, 120);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    paint();
  };

  const pickCell = (event: PointerEvent): Cell | null => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const data = obj.userData as { row?: number; col?: number };
        if (typeof data.row === 'number' && typeof data.col === 'number') {
          return { row: data.row, col: data.col };
        }
        obj = obj.parent;
      }
    }
    return null;
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (!clickHandler || disposed) return;
    const cell = pickCell(event);
    if (cell) clickHandler(cell);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!hoverHandler || disposed) return;
    hoverHandler(pickCell(event));
  };

  const onPointerLeave = (): void => {
    if (!hoverHandler || disposed) return;
    hoverHandler(null);
  };

  let tearDown: (() => void) | null = null;

  const onContextLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) return;
    // Tear down WebGL resources, then let the controller fall back to 2D.
    tearDown?.();
    container.dispatchEvent(new CustomEvent('mp3d-context-lost'));
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

  const clearGroup = (group: Object3D): void => {
    while (group.children.length > 0) {
      group.remove(group.children[0]!);
    }
  };

  const addBlockCell = (
    group: Object3D,
    row: number,
    col: number,
    bodyMat: Material,
    bevelMat: Material,
    yLift = 0
  ): void => {
    const { x, z } = boardToWorld(row, col);
    const body = new THREE.Mesh(blockGeo, bodyMat);
    body.position.set(x, TILE_H / 2 + BLOCK_H / 2 + yLift, z);
    body.userData = { row, col, kind: 'block' };
    group.add(body);
    const bevel = new THREE.Mesh(bevelGeo, bevelMat);
    bevel.position.set(x, TILE_H / 2 + BLOCK_H + BEVEL_H / 2 + yLift, z);
    bevel.userData = { row, col, kind: 'bevel' };
    group.add(bevel);
  };

  const ownerLabel = (owner: Player | null): string | undefined => {
    if (owner === 'player1') return 'Blue';
    if (owner === 'player2') return 'Red';
    return undefined;
  };

  const syncA11y = (
    state: PentEmInState,
    handler?: CellClickCallback,
    hover?: CellHoverCallback
  ): void => {
    const prevFocus = captureFocusedCell(a11y);
    a11y.replaceChildren();

    const occupancy = new Map<string, Player | null>();
    for (const piece of state.placedPieces) {
      for (const cell of piece.cells) {
        occupancy.set(`${cell.row},${cell.col}`, piece.player);
      }
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-row', String(row));
        btn.setAttribute('data-col', String(col));
        const occupant = occupancy.get(`${row},${col}`) ?? null;
        makeGridCell(
          btn,
          buildCellAriaLabel({
            coord: `${row},${col}`,
            empty: occupant === null,
            owner: ownerLabel(occupant),
            validPlacement:
              state.phase === 'placePiece' && !!state.selectedPiece,
          })
        );
        const activate = (): void => handler?.({ row, col });
        btn.addEventListener('click', activate);
        bindCellActivateKeys(btn, activate);
        btn.addEventListener('focus', () => {
          focusedCell = { row, col };
          hover?.({ row, col });
        });
        a11y.appendChild(btn);
      }
    }

    restoreGridFocus(a11y, prevFocus);
    if (!prevFocus) {
      applyRovingTabindex(collectGridCells(a11y));
    }
  };

  const update = (
    state: PentEmInState,
    nextClick?: CellClickCallback,
    nextHover?: CellHoverCallback
  ): void => {
    if (disposed) return;
    clickHandler = nextClick;
    hoverHandler = nextHover;

    // Refresh seat-colored mats when chrome may have changed (AI seat)
    const nextSeats = getPlayerSeatColors();
    mats.p1.color.set(nextSeats.player1);
    mats.p2.color.set(nextSeats.player2);
    mats.p1Win.color.set(nextSeats.player1);
    mats.p2Win.color.set(nextSeats.player2);
    mats.p1Win.emissive.set(nextSeats.player1);
    mats.p2Win.emissive.set(nextSeats.player2);
    mats.ghostOk.color.set(nextSeats[state.currentPlayer]);

    const validAnchors = new Set<string>();
    if (state.phase === 'placePiece' && state.selectedPiece) {
      for (const pos of getValidPlacements(
        state,
        state.selectedPiece,
        state.selectedRotation,
        state.selectedFlipped
      )) {
        validAnchors.add(`${pos.row},${pos.col}`);
      }
    }

    const lastCells = new Set<string>();
    const last = state.moveHistory[state.moveHistory.length - 1];
    if (last) {
      for (const cell of getPieceCells(
        last.shapeId,
        last.position,
        last.rotation,
        last.flipped
      )) {
        lastCells.add(`${cell.row},${cell.col}`);
      }
    }

    const previewKey = state.previewPosition
      ? `${state.previewPosition.row},${state.previewPosition.col}`
      : focusedCell
        ? `${focusedCell.row},${focusedCell.col}`
        : null;

    for (const tm of tiles) {
      const key = `${tm.row},${tm.col}`;
      const isLight = (tm.row + tm.col) % 2 === 0;
      let mat: Material = isLight ? mats.light : mats.dark;
      if (validAnchors.has(key)) mat = mats.valid;
      if (lastCells.has(key)) mat = mats.last;
      if (previewKey === key) mat = mats.focus;
      tm.tile.material = mat;
    }

    clearGroup(pieceRoot);
    for (const piece of state.placedPieces) {
      const win = state.phase === 'gameOver' && state.winner === piece.player;
      const bodyMat =
        piece.player === 'player1'
          ? win
            ? mats.p1Win
            : mats.p1
          : win
            ? mats.p2Win
            : mats.p2;
      for (const cell of piece.cells) {
        addBlockCell(pieceRoot, cell.row, cell.col, bodyMat, bodyMat);
      }
    }

    clearGroup(ghostRoot);
    const previewAnchor = state.previewPosition ?? focusedCell;
    if (state.phase === 'placePiece' && state.selectedPiece && previewAnchor) {
      const cells = getPieceCells(
        state.selectedPiece,
        previewAnchor,
        state.selectedRotation,
        state.selectedFlipped
      );
      const legal = canPlacePiece(
        state,
        state.selectedPiece,
        previewAnchor,
        state.selectedRotation,
        state.selectedFlipped
      );
      const ghostMat = legal ? mats.ghostOk : mats.ghostBad;
      for (const cell of cells) {
        if (
          cell.row < 0 ||
          cell.row >= BOARD_SIZE ||
          cell.col < 0 ||
          cell.col >= BOARD_SIZE
        ) {
          continue;
        }
        addBlockCell(ghostRoot, cell.row, cell.col, ghostMat, ghostMat, 0.02);
      }
    }

    syncA11y(state, clickHandler, hoverHandler);
    paint();
  };

  const cellToClientPoint = (
    row: number,
    col: number
  ): { x: number; y: number } => {
    const { x, z } = boardToWorld(row, col);
    projectScratch.set(x, TILE_H / 2 + BLOCK_H / 2, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  window.__mp3dPentEmIn = { cellToClientPoint };

  const unmount = (): void => {
    if (disposed) return;
    disposed = true;
    unbindVisibility();
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    window.removeEventListener('resize', onResize);
    if (window.__mp3dPentEmIn) {
      delete window.__mp3dPentEmIn;
    }
    clearGroup(pieceRoot);
    clearGroup(ghostRoot);
    while (root.children.length > 0) root.remove(root.children[0]!);
    scene.remove(root);
    tileGeo.dispose();
    blockGeo.dispose();
    bevelGeo.dispose();
    slabGeo.dispose();
    Object.values(mats).forEach((m) => m.dispose());
    slabMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    if (a11y.parentElement) a11y.parentElement.removeChild(a11y);
    container.classList.remove('board-3d-host', 'pent-board-3d-host');
  };
  tearDown = unmount;

  resize();
  return { update, unmount, cellToClientPoint, canvas };
}
