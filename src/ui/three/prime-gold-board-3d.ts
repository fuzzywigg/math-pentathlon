/**
 * Three.js tilted-tabletop 3D board for Prime Gold.
 *
 * Tablet-friendly (vs Kings #352 weak spots; FIAR #359 patterns as reference):
 * - antialias off, pixelRatio capped at TABLET_PIXEL_RATIO_CAP
 * - preserveDrawingBuffer gated; pause paints while the tab is hidden
 * - render-on-demand (no continuous RAF)
 * - size to available width/height
 * - throws when WebGL is unavailable so the controller can keep 2D
 * - webglcontextlost → tear down + `mp3d-context-lost` for 2D fallback
 * - hidden a11y grid mirrors state and drives the same click path
 *
 * Original procedural number textures only — no kit photos.
 */

import type { PrimeGoldState, Player } from '../../games/prime-gold/types';
import { CONFIG } from '../../games/prime-gold/types';
import {
  getValidPlacements,
  getPrimeVeinSegments,
} from '../../games/prime-gold/rules';
import { getPlayerSeatColors } from '../player-colors';
import { bindCanvasPointerTap } from '../pointer-hygiene';
import { loadThree, type ThreeModule } from './load-three';
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

export type PrimeGoldCellClickCallback = (value: number, expr: string) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type Material = InstanceType<Three['Material']>;
type CanvasTexture = InstanceType<Three['CanvasTexture']>;
type LineSegments = InstanceType<Three['LineSegments']>;

const BOARD_SIZE = CONFIG.BOARD_SIZE;
const CELL = 1;
const GAP = 0.08;
const STEP = CELL + GAP;
const TILE_H = 0.2;
const TILE_TOP_Y = TILE_H / 2;
const CHIP_R = 0.28;
const CHIP_H = 0.14;

export interface PrimeGoldBoard3D {
  update(state: PrimeGoldState, onCellClick?: PrimeGoldCellClickCallback): void;
  unmount(): void;
  cellToClientPoint(row: number, col: number): { x: number; y: number } | null;
  valueToClientPoint(value: number): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

interface CellMeshes {
  row: number;
  col: number;
  value: number;
  tile: Mesh;
  label: Mesh;
  chip: Mesh | null;
  baseTileMat: Material;
  primeTileMat: Material;
  labelTex: CanvasTexture;
}

declare global {
  interface Window {
    __mp3dPrimeGold?: {
      cellToClientPoint: (
        row: number,
        col: number
      ) => { x: number; y: number } | null;
      valueToClientPoint: (value: number) => { x: number; y: number } | null;
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

function parseCssColor(
  THREE: Three,
  css: string
): InstanceType<Three['Color']> {
  const c = new THREE.Color();
  try {
    c.set(css);
  } catch {
    c.set(0x888888);
  }
  return c;
}

function makeNumberTexture(
  THREE: Three,
  value: number,
  isPrime: boolean
): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  ctx.clearRect(0, 0, size, size);
  // Soft disc so numbers read as printed tiles, not raw rectangles
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size * 0.48
  );
  if (isPrime) {
    grad.addColorStop(0, '#ffe082');
    grad.addColorStop(1, '#c9a227');
  } else {
    grad.addColorStop(0, '#eceff1');
    grad.addColorStop(1, '#b0bec5');
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isPrime ? '#1b1404' : '#1a2332';
  ctx.font = 'bold 58px "Trebuchet MS", "Gill Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(value), size / 2, size / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  if ('SRGBColorSpace' in THREE && 'colorSpace' in tex) {
    (tex as CanvasTexture & { colorSpace: unknown }).colorSpace =
      THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

/**
 * Create and mount a 3D Prime Gold board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D.
 */
export async function createPrimeGoldBoard3D(
  container: HTMLElement,
  onCellClick?: PrimeGoldCellClickCallback
): Promise<PrimeGoldBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'pg-board-3d-host');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.aspectRatio = '1';
  container.style.minHeight = 'min(360px, 72vw)';
  container.style.maxHeight = 'min(720px, 70vh)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Cool slate tabletop atmosphere (original procedural look)
  scene.background = new THREE.Color(0x15202b);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 10.4, 9.2);
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
      `WebGLRenderer failed — Prime Gold 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }

  renderer.setPixelRatio(resolveBoard3dPixelRatio());
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'prime-gold');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Prime Gold 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  // Visually-hidden a11y grid (keyboard / screen reader)
  const a11y = document.createElement('div');
  a11y.className = 'pg-a11y-grid';
  a11y.setAttribute('role', 'grid');
  a11y.setAttribute('aria-label', 'Prime Gold board spaces');
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  container.appendChild(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.48);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xe8f0ff, 0x2a2014, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6e8, 0.82);
  key.position.set(5, 14, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  // Table slab
  const slabSize = BOARD_SIZE * STEP + 0.7;
  const slabGeo = new THREE.BoxGeometry(slabSize, 0.16, slabSize);
  const slabMat = new THREE.MeshLambertMaterial({ color: 0x1c2a38 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = -0.12;
  root.add(slab);

  // Thin gold rim
  const rimMat = new THREE.MeshLambertMaterial({ color: 0xb8962e });
  const rimT = 0.12;
  for (const [x, z, sx, sz] of [
    [0, -(slabSize / 2 - rimT / 2), slabSize, rimT],
    [0, slabSize / 2 - rimT / 2, slabSize, rimT],
    [-(slabSize / 2 - rimT / 2), 0, rimT, slabSize],
    [slabSize / 2 - rimT / 2, 0, rimT, slabSize],
  ] as const) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.06, sz), rimMat);
    edge.position.set(x, -0.02, z);
    root.add(edge);
  }

  const seats = getPlayerSeatColors();
  const p1 = parseCssColor(THREE, seats.player1);
  const p2 = parseCssColor(THREE, seats.player2);

  const mats = {
    tile: new THREE.MeshLambertMaterial({ color: 0x3d4f63 }),
    tilePrime: new THREE.MeshLambertMaterial({ color: 0xc9a227 }),
    tileValid: new THREE.MeshLambertMaterial({ color: 0x43a047 }),
    tileLast: new THREE.MeshLambertMaterial({ color: 0x5c9ead }),
    tileFocus: new THREE.MeshLambertMaterial({ color: 0xffb74d }),
    tileVein1: new THREE.MeshLambertMaterial({
      color: p1.clone().lerp(new THREE.Color(0xffffff), 0.22),
    }),
    tileVein2: new THREE.MeshLambertMaterial({
      color: p2.clone().lerp(new THREE.Color(0xffffff), 0.22),
    }),
    p1: new THREE.MeshLambertMaterial({ color: p1 }),
    p2: new THREE.MeshLambertMaterial({ color: p2 }),
    veinLine1: new THREE.LineBasicMaterial({ color: p1 }),
    veinLine2: new THREE.LineBasicMaterial({ color: p2 }),
  };

  const tileGeo = new THREE.BoxGeometry(CELL, TILE_H, CELL);
  const labelGeo = new THREE.PlaneGeometry(CELL * 0.78, CELL * 0.78);
  const chipGeo = new THREE.CylinderGeometry(CHIP_R, CHIP_R * 0.92, CHIP_H, 20);

  const cells: CellMeshes[] = [];
  const valueIndex = new Map<number, CellMeshes>();
  const labelMats: Material[] = [];
  const labelTextures: CanvasTexture[] = [];

  let clickHandler: PrimeGoldCellClickCallback | undefined = onCellClick;
  let lastState: PrimeGoldState | null = null;
  let focusedValue: number | null = null;
  let disposed = false;
  let veinLines: LineSegments[] = [];
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
    const w = Math.max(container.clientWidth || 420, 120);
    const h = Math.max(container.clientHeight || 420, 120);
    syncBoard3dRendererSize(renderer, camera, w, h);
    paint();
  };

  const clearChip = (cm: CellMeshes): void => {
    if (!cm.chip) {
      return;
    }
    root.remove(cm.chip);
    cm.chip = null;
  };

  const clearVeinLines = (): void => {
    for (const line of veinLines) {
      root.remove(line);
      line.geometry.dispose();
    }
    veinLines = [];
  };

  const buildCellsFromState = (state: PrimeGoldState): void => {
    if (cells.length > 0) {
      return;
    }
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = state.cells.get(`${row},${col}`);
        if (!cell) {
          continue;
        }
        const { x, z } = boardToWorld(row, col);

        const baseTileMat = mats.tile.clone();
        const primeTileMat = mats.tilePrime.clone();
        const tile = new THREE.Mesh(
          tileGeo,
          cell.isPrime ? primeTileMat : baseTileMat
        );
        tile.position.set(x, 0, z);
        tile.userData = {
          row,
          col,
          value: cell.value,
          kind: 'tile',
        };
        root.add(tile);

        const labelTex = makeNumberTexture(THREE, cell.value, cell.isPrime);
        labelTextures.push(labelTex);
        const labelMat = new THREE.MeshLambertMaterial({
          map: labelTex,
          transparent: true,
          depthWrite: false,
        });
        labelMats.push(labelMat);
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.rotation.x = -Math.PI / 2;
        label.position.set(x, TILE_TOP_Y + 0.012, z);
        label.userData = {
          row,
          col,
          value: cell.value,
          kind: 'label',
        };
        root.add(label);

        const cm: CellMeshes = {
          row,
          col,
          value: cell.value,
          tile,
          label,
          chip: null,
          baseTileMat,
          primeTileMat,
          labelTex,
        };
        cells.push(cm);
        valueIndex.set(cell.value, cm);
      }
    }
  };

  const syncA11y = (
    state: PrimeGoldState,
    handler?: PrimeGoldCellClickCallback
  ): void => {
    a11y.replaceChildren();
    const validMap = new Map(
      getValidPlacements(state).map((p) => [p.value, p.expr])
    );
    let firstFocusable: HTMLButtonElement | null = null;

    for (const cm of cells) {
      const cell = state.cells.get(`${cm.row},${cm.col}`);
      if (!cell) {
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('data-row', String(cm.row));
      btn.setAttribute('data-col', String(cm.col));
      btn.setAttribute('data-value', String(cell.value));
      const owner =
        cell.owner === 'player1'
          ? 'Blue'
          : cell.owner === 'player2'
            ? 'Red'
            : 'empty';
      const extras = cell.isPrime ? ', prime' : '';
      btn.setAttribute('aria-label', `Number ${cell.value}, ${owner}${extras}`);
      btn.tabIndex = -1;
      const expr = validMap.get(cell.value);
      if (expr) {
        btn.tabIndex = 0;
        if (!firstFocusable) {
          firstFocusable = btn;
        }
        btn.addEventListener('click', () => handler?.(cell.value, expr));
      }
      btn.addEventListener('focus', () => {
        focusedValue = cell.value;
        if (lastState) {
          // Re-highlight without changing click handler
          applyHighlights(lastState);
          paint();
        }
      });
      a11y.appendChild(btn);
    }

    if (!a11y.querySelector('[tabindex="0"]')) {
      const first = a11y.querySelector('button');
      if (first) {
        (first as HTMLButtonElement).tabIndex = 0;
      }
    } else if (firstFocusable && document.activeElement === document.body) {
      // leave focus alone; roving happens via Tab into the grid
      void firstFocusable;
    }
  };

  const applyHighlights = (state: PrimeGoldState): void => {
    const valid = new Set(getValidPlacements(state).map((p) => p.value));
    const last = state.moveHistory[state.moveHistory.length - 1] ?? null;
    const veinCells = new Map<string, Player>();
    for (const player of ['player1', 'player2'] as const) {
      for (const seg of getPrimeVeinSegments(state.cells, player)) {
        for (const c of seg) {
          veinCells.set(`${c.row},${c.col}`, player);
        }
      }
    }

    for (const cm of cells) {
      const cell = state.cells.get(`${cm.row},${cm.col}`);
      if (!cell) {
        continue;
      }

      let tileMat: Material = cell.isPrime ? cm.primeTileMat : cm.baseTileMat;
      const veinOwner = veinCells.get(`${cm.row},${cm.col}`);
      if (valid.has(cell.value)) {
        tileMat = mats.tileValid;
      } else if (focusedValue === cell.value) {
        tileMat = mats.tileFocus;
      } else if (veinOwner === 'player1') {
        tileMat = mats.tileVein1;
      } else if (veinOwner === 'player2') {
        tileMat = mats.tileVein2;
      } else if (last && last.row === cm.row && last.col === cm.col) {
        tileMat = mats.tileLast;
      }

      cm.tile.material = tileMat;
    }
  };

  const syncVeins = (state: PrimeGoldState): void => {
    clearVeinLines();
    for (const player of ['player1', 'player2'] as const) {
      const segs = getPrimeVeinSegments(state.cells, player);
      for (const seg of segs) {
        if (seg.length < 2) {
          continue;
        }
        const paired: number[] = [];
        for (let i = 0; i + 1 < seg.length; i++) {
          const a = boardToWorld(seg[i]!.row, seg[i]!.col);
          const b = boardToWorld(seg[i + 1]!.row, seg[i + 1]!.col);
          paired.push(
            a.x,
            TILE_TOP_Y + CHIP_H + 0.08,
            a.z,
            b.x,
            TILE_TOP_Y + CHIP_H + 0.08,
            b.z
          );
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(paired, 3)
        );
        const line = new THREE.LineSegments(
          geo,
          player === 'player1' ? mats.veinLine1 : mats.veinLine2
        );
        root.add(line);
        veinLines.push(line);
      }
    }
  };

  const syncChips = (state: PrimeGoldState): void => {
    for (const cm of cells) {
      const cell = state.cells.get(`${cm.row},${cm.col}`);
      if (!cell || !cell.owner) {
        clearChip(cm);
        continue;
      }
      const chipMat = cell.owner === 'player1' ? mats.p1 : mats.p2;
      const { x, z } = boardToWorld(cm.row, cm.col);
      if (!cm.chip) {
        cm.chip = new THREE.Mesh(chipGeo, chipMat);
        cm.chip.userData = {
          row: cm.row,
          col: cm.col,
          value: cm.value,
          kind: 'chip',
        };
        root.add(cm.chip);
      } else {
        cm.chip.material = chipMat;
      }
      cm.chip.position.set(x, TILE_TOP_Y + CHIP_H / 2 + 0.02, z);
    }
  };

  const onPointer = (event: PointerEvent): void => {
    if (!clickHandler || disposed || !lastState) {
      return;
    }
    if (lastState.phase !== 'placing') {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const ndc = clientToNdc(event.clientX, event.clientY, rect);
    if (!ndc) {
      return;
    }
    pointer.x = ndc.x;
    pointer.y = ndc.y;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    const validMap = new Map(
      getValidPlacements(lastState).map((p) => [p.value, p.expr])
    );
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const value = obj.userData?.value as number | undefined;
        if (typeof value === 'number') {
          const expr = validMap.get(value);
          if (expr) {
            clickHandler(value, expr);
            return;
          }
          return;
        }
        obj = obj.parent;
      }
    }
  };

  const onContextLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) {
      return;
    }
    unmount();
    container.dispatchEvent(new CustomEvent('mp3d-context-lost'));
  };

  const unbindVisibility = bindPageVisibility({
    onVisible: () => paint(),
  });
  const unbindPointer = bindCanvasPointerTap(canvas, {
    onTap: onPointer,
  });
  canvas.addEventListener('webglcontextlost', onContextLost, false);
  const unbindLayout = bindBoard3dLayout(container, () => resize());

  const cellToClientPoint = (
    row: number,
    col: number
  ): { x: number; y: number } | null => {
    if (row < 0 || col < 0 || row >= BOARD_SIZE || col >= BOARD_SIZE) {
      return null;
    }
    const { x, z } = boardToWorld(row, col);
    projectScratch.set(x, TILE_TOP_Y + 0.1, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  const valueToClientPoint = (
    value: number
  ): { x: number; y: number } | null => {
    const cm = valueIndex.get(value);
    if (!cm) {
      return null;
    }
    return cellToClientPoint(cm.row, cm.col);
  };

  window.__mp3dPrimeGold = { cellToClientPoint, valueToClientPoint };

  const update = (
    state: PrimeGoldState,
    nextClick?: PrimeGoldCellClickCallback
  ): void => {
    if (disposed) {
      return;
    }
    clickHandler = nextClick;
    lastState = state;
    buildCellsFromState(state);
    syncChips(state);
    applyHighlights(state);
    syncVeins(state);
    syncA11y(state, clickHandler);
    paint();
  };

  let cancelMountPaint: () => void = () => undefined;
  const unmount = (): void => {
    if (disposed) {
      return;
    }
    disposed = true;
    cancelMountPaint();
    unbindVisibility();
    unbindPointer();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    unbindLayout();
    if (window.__mp3dPrimeGold) {
      delete window.__mp3dPrimeGold;
    }
    clearVeinLines();
    for (const cm of cells) {
      clearChip(cm);
      cm.baseTileMat.dispose();
      cm.primeTileMat.dispose();
    }
    cells.length = 0;
    valueIndex.clear();
    while (root.children.length > 0) {
      root.remove(root.children[0]!);
    }
    scene.remove(root);
    tileGeo.dispose();
    labelGeo.dispose();
    chipGeo.dispose();
    slabGeo.dispose();
    for (const tex of labelTextures) {
      tex.dispose();
    }
    for (const m of labelMats) {
      m.dispose();
    }
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
    container.classList.remove('board-3d-host', 'pg-board-3d-host');
  };

  resize();
  cancelMountPaint = scheduleBoard3dMountPaint(paint);

  return { update, unmount, cellToClientPoint, valueToClientPoint, canvas };
}
