/**
 * Three.js 3D board view for Kings & Quadraphages.
 * Mounts a WebGL canvas, renders the current GameState, and forwards cell
 * picks to the existing controller click handler.
 */

import type {
  GameState,
  Position,
} from '../../games/kings-quadraphages/game-state';
import { loadThree, type ThreeModule } from './load-three';

export type CellClickCallback = (row: number, col: number) => void;

const BOARD_SIZE = 9;
const CELL = 1;
const GAP = 0.06;
const STEP = CELL + GAP;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;

export interface KingsBoard3D {
  update(state: GameState, onCellClick?: CellClickCallback): void;
  unmount(): void;
  readonly canvas: HTMLCanvasElement;
}

interface CellMeshes {
  tile: Mesh;
  piece: Mesh | null;
  row: number;
  col: number;
}

function boardToWorld(row: number, col: number): { x: number; z: number } {
  const origin = -((BOARD_SIZE - 1) * STEP) / 2;
  return {
    x: origin + (col - 1) * STEP,
    z: origin + (row - 1) * STEP,
  };
}

/** Local highlight helper — avoids a runtime import cycle with the game chunk. */
function isKingMoveTarget(state: GameState, row: number, col: number): boolean {
  const sel = state.selectedKingPosition;
  if (!sel || state.turnPhase !== 'moveKing') return false;
  if (sel.row === row && sel.col === col) return false;
  if (Math.abs(sel.row - row) > 1 || Math.abs(sel.col - col) > 1) return false;
  if (row < 1 || row > BOARD_SIZE || col < 1 || col > BOARD_SIZE) return false;
  return state.board[row - 1]![col - 1] === null;
}

/**
 * Create and mount a 3D Kings board into `container`.
 * Caller must call `unmount()` on route change / destroy.
 */
export async function createKingsBoard3D(
  container: HTMLElement,
  onCellClick?: CellClickCallback
): Promise<KingsBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host');
  container.style.minHeight = container.style.minHeight || 'min(450px, 100vw)';
  container.style.width = container.style.width || 'min(450px, 100%)';
  container.style.aspectRatio = container.style.aspectRatio || '1';
  container.style.margin = container.style.margin || '0 auto';
  container.style.position = container.style.position || 'relative';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a2332);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 14, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'kings');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(6, 12, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  const tileGeo = new THREE.BoxGeometry(CELL, 0.22, CELL);
  const pieceKingGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.7, 16);
  const pieceQuadGeo = new THREE.SphereGeometry(0.28, 16, 12);

  const mats = {
    light: new THREE.MeshLambertMaterial({ color: 0xe8d5b7 }),
    dark: new THREE.MeshLambertMaterial({ color: 0xb08968 }),
    selected: new THREE.MeshLambertMaterial({ color: 0xf0e68c }),
    valid: new THREE.MeshLambertMaterial({ color: 0x90ee90 }),
    last: new THREE.MeshLambertMaterial({ color: 0x87ceeb }),
    p1King: new THREE.MeshLambertMaterial({ color: 0x2563eb }),
    p2King: new THREE.MeshLambertMaterial({ color: 0xdc2626 }),
    p1Quad: new THREE.MeshLambertMaterial({ color: 0x3b82f6 }),
    p2Quad: new THREE.MeshLambertMaterial({ color: 0xef4444 }),
  };

  const cells: CellMeshes[] = [];
  for (let row = 1; row <= BOARD_SIZE; row++) {
    for (let col = 1; col <= BOARD_SIZE; col++) {
      const isLight = (row + col) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isLight ? mats.light : mats.dark);
      const { x, z } = boardToWorld(row, col);
      tile.position.set(x, 0, z);
      tile.userData = { row, col, kind: 'tile' };
      root.add(tile);
      cells.push({ tile, piece: null, row, col });
    }
  }

  let clickHandler: CellClickCallback | undefined = onCellClick;
  let rafId = 0;
  let disposed = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const resize = (): void => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 450, 120);
    const h = Math.max(container.clientHeight || 450, 120);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const animate = (): void => {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
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
        const data = obj.userData as { row?: number; col?: number };
        if (typeof data.row === 'number' && typeof data.col === 'number') {
          clickHandler(data.row, data.col);
          return;
        }
        obj = obj.parent;
      }
    }
  };

  const onResize = (): void => resize();

  canvas.addEventListener('pointerup', onPointer);
  window.addEventListener('resize', onResize);
  resize();
  animate();

  const clearPiece = (cell: CellMeshes): void => {
    if (!cell.piece) return;
    // Shared geometries/materials — only detach; dispose happens in unmount.
    root.remove(cell.piece);
    cell.piece = null;
  };

  const syncPiece = (cell: CellMeshes, state: GameState): void => {
    const { row, col } = cell;
    const piece = state.board[row - 1]![col - 1] ?? null;
    const existing = cell.piece;
    const existingKind = existing?.userData?.kind as string | undefined;
    const existingOwner = existing?.userData?.owner as string | undefined;

    if (!piece) {
      clearPiece(cell);
      return;
    }

    if (
      existing &&
      existingKind === piece.type &&
      existingOwner === piece.owner
    ) {
      return;
    }

    clearPiece(cell);
    const { x, z } = boardToWorld(row, col);

    if (piece.type === 'king') {
      const mesh = new THREE.Mesh(
        pieceKingGeo,
        piece.owner === 'player1' ? mats.p1King : mats.p2King
      );
      mesh.position.set(x, 0.45, z);
      mesh.userData = { row, col, kind: 'king', owner: piece.owner };
      root.add(mesh);
      cell.piece = mesh;
      return;
    }

    const mesh = new THREE.Mesh(
      pieceQuadGeo,
      piece.owner === 'player1' ? mats.p1Quad : mats.p2Quad
    );
    mesh.position.set(x, 0.35, z);
    mesh.userData = { row, col, kind: 'quadraphage', owner: piece.owner };
    root.add(mesh);
    cell.piece = mesh;
  };

  const update = (state: GameState, nextClick?: CellClickCallback): void => {
    if (disposed) return;
    clickHandler = nextClick;

    const last: Position | null =
      state.moveHistory.length > 0
        ? state.moveHistory[state.moveHistory.length - 1]!.to
        : null;

    for (const cell of cells) {
      const { row, col } = cell;
      const piece = state.board[row - 1]![col - 1] ?? null;
      const isLight = (row + col) % 2 === 0;
      let tileMat = isLight ? mats.light : mats.dark;

      const isSelected =
        !!state.selectedKingPosition &&
        state.selectedKingPosition.row === row &&
        state.selectedKingPosition.col === col;
      const isValidMoveTarget = isKingMoveTarget(state, row, col);
      const isValidPlacement =
        state.turnPhase === 'placeQuadraphage' && piece === null;
      const isLast = !!last && last.row === row && last.col === col;

      if (isSelected) tileMat = mats.selected;
      else if (isValidMoveTarget || isValidPlacement) tileMat = mats.valid;
      else if (isLast) tileMat = mats.last;

      cell.tile.material = tileMat;
      syncPiece(cell, state);
    }
  };

  const unmount = (): void => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    canvas.removeEventListener('pointerup', onPointer);
    window.removeEventListener('resize', onResize);

    for (const cell of cells) {
      clearPiece(cell);
    }

    // Detach tiles (shared geo/mats disposed below once).
    while (root.children.length > 0) {
      root.remove(root.children[0]!);
    }
    scene.remove(root);
    tileGeo.dispose();
    pieceKingGeo.dispose();
    pieceQuadGeo.dispose();
    Object.values(mats).forEach((m) => m.dispose());

    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement === container) {
      container.removeChild(canvas);
    } else if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
    container.classList.remove('board-3d-host');
  };

  return { update, unmount, canvas };
}
