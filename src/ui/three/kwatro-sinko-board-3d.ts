/**
 * Three.js tilted-tabletop 3D board for Kwatro-Sinko.
 *
 * Tablet-friendly (aligned with FIAR / Queens & Guards):
 * - antialias off, pixelRatio capped at TABLET_PIXEL_RATIO_CAP
 * - render-on-demand (no continuous RAF); skip paints while document.hidden
 * - preserveDrawingBuffer gated to Playwright / opt-in
 * - webglcontextlost → tear down + `mp3d-context-lost` for 2D fallback
 * - full-size host
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 * - visually-hidden keyboard/a11y grid mirroring engine state
 */

import type { Chip, KwaState, Player } from '../../games/kwatro-sinko/types';
import { getValidMoves } from '../../games/kwatro-sinko/rules';
import { getPlayerSeatColors } from '../player-colors';
import { prefersReducedMotion } from '../reduced-motion';
import {
  applyRovingTabindex,
  bindCellActivateKeys,
  bindGridNavigation,
  buildCellAriaLabel,
  collectGridCells,
  makeGridCell,
  markBoardAsGrid,
} from '../board-a11y';
import { loadThree, type ThreeModule } from './load-three';
import {
  resolveBoard3dPixelRatio,
  paintBoard3dAndMarkReady,
  scheduleBoard3dMountPaint,
  bindPageVisibility,
  shouldPreserveDrawingBuffer,
} from './tablet-gl';

/** Undirected pathway keys for drawing (handles one-way engine links). */
export function collectPathwayEdgeKeys(state: KwaState): string[] {
  const seen = new Set<string>();
  for (const node of state.nodes.values()) {
    for (const connId of node.connections) {
      const key =
        node.id < connId ? `${node.id}|${connId}` : `${connId}|${node.id}`;
      seen.add(key);
    }
  }
  return [...seen];
}

export type KwatroNodeClickCallback = (nodeId: string) => void;
export type KwatroChipClickCallback = (chipId: string) => void;

type Three = ThreeModule;
type Object3D = InstanceType<Three['Object3D']>;
type Mesh = InstanceType<Three['Mesh']>;
type LineSegments = InstanceType<Three['LineSegments']>;
type CanvasTexture = InstanceType<Three['CanvasTexture']>;

const SIZE = 5;
const STEP = 1.2;
const NODE_R = 0.42;
const CHIP_R = 0.34;
const CHIP_H = 0.14;
const BOARD_Y = 0;
const PAD_TOP_Y = BOARD_Y + 0.04;

export interface KwatroSinkoBoard3D {
  update(
    state: KwaState,
    onNodeClick?: KwatroNodeClickCallback,
    onChipClick?: KwatroChipClickCallback
  ): void;
  unmount(): void;
  nodeToClientPoint(nodeId: string): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __mp3dKwatroSinko?: {
      nodeToClientPoint: (nodeId: string) => { x: number; y: number } | null;
    };
  }
}

export function parseKwatroNodeId(
  id: string
): { row: number; col: number } | null {
  const match = /^n(\d+)-(\d+)$/.exec(id);
  if (!match) return null;
  return { row: Number(match[1]), col: Number(match[2]) };
}

/** Layout world coords: col → x, row → z (row 4 nearer the camera). */
export function nodeToWorld(
  row: number,
  col: number
): { x: number; z: number } {
  const origin = -((SIZE - 1) * STEP) / 2;
  return {
    x: origin + col * STEP,
    z: origin + row * STEP,
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

function makeChipNumberTexture(
  THREE: Three,
  value: number,
  seatHex: string
): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // jsdom / unit mocks often stub getContext without a full 2d API
  if (!ctx || typeof ctx.clearRect !== 'function') {
    return new THREE.CanvasTexture(canvas);
  }
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = seatHex;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px "Trebuchet MS", "Gill Sans", sans-serif';
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

interface NodeMeshes {
  id: string;
  row: number;
  col: number;
  pad: Mesh;
  chipBody: Mesh | null;
  chipLabel: Mesh | null;
  chipValue: number | null;
  chipOwner: Player | null;
}

/**
 * Create and mount a 3D Kwatro-Sinko board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createKwatroSinkoBoard3D(
  container: HTMLElement,
  onNodeClick?: KwatroNodeClickCallback,
  onChipClick?: KwatroChipClickCallback
): Promise<KwatroSinkoBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  // Keep `.kwa-board` so tutorial highlightSelector works in both views.
  container.classList.add('board-3d-host', 'kwa-board-3d-host', 'kwa-board');
  container.style.width = '100%';
  container.style.maxWidth = '100%';
  container.style.aspectRatio = '1';
  container.style.minHeight = 'min(360px, 72vw)';
  container.style.maxHeight = 'min(72vh, 720px)';
  container.style.margin = '0 auto';
  container.style.position = 'relative';

  const scene = new THREE.Scene();
  // Warm wood-table atmosphere (Queens #367 direction)
  scene.background = new THREE.Color(0x2a2118);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  // Tilted tabletop — row 4 nearer the lens
  camera.position.set(0, 10.6, 9.6);
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
      `WebGLRenderer failed — Kwatro-Sinko 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(resolveBoard3dPixelRatio());
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'kwatro-sinko');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Kwatro-Sinko 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  container.appendChild(canvas);

  // Full-size opacity-0 hit grid (not 1px-clipped) so smoke selectors
  // `.kwa-selectable-chip` / `.kwa-valid-node` stay Playwright-visible while
  // the canvas paints the board. Non-interactive cells let pointer events
  // fall through to the canvas raycaster.
  const a11y = document.createElement('div');
  a11y.className = 'kwa-a11y-grid';
  markBoardAsGrid(a11y);
  a11y.setAttribute('aria-label', 'Kwatro-Sinko board spaces');
  a11y.style.cssText = [
    'position:absolute',
    'inset:0',
    'z-index:2',
    'opacity:0',
    'display:grid',
    `grid-template-columns:repeat(${SIZE},1fr)`,
    `grid-template-rows:repeat(${SIZE},1fr)`,
    'pointer-events:none',
    'margin:0',
    'padding:0',
    'border:0',
  ].join(';');
  container.appendChild(a11y);
  bindGridNavigation(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.48);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xf5e6c8, 0x2a1f14, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff4e0, 0.8);
  key.position.set(5, 14, 4);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  const boardSpan = SIZE * STEP + 0.7;
  const slabGeo = new THREE.BoxGeometry(boardSpan, 0.22, boardSpan);
  const woodMap = createWoodGrainTexture(THREE);
  const slabMat = new THREE.MeshLambertMaterial({
    color: 0x8b6239,
    map: woodMap,
  });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = BOARD_Y - 0.14;
  root.add(slab);

  const rimMat = new THREE.MeshLambertMaterial({ color: 0x3e2a16 });
  for (const [x, z, sx, sz] of [
    [0, -(boardSpan / 2 - 0.08), boardSpan, 0.16],
    [0, boardSpan / 2 - 0.08, boardSpan, 0.16],
    [-(boardSpan / 2 - 0.08), 0, 0.16, boardSpan],
    [boardSpan / 2 - 0.08, 0, 0.16, boardSpan],
  ] as const) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.08, sz), rimMat);
    edge.position.set(x, BOARD_Y - 0.02, z);
    root.add(edge);
  }

  const seats = getPlayerSeatColors();
  const mats = {
    pad: new THREE.MeshLambertMaterial({ color: 0xe8dcc0 }),
    padNumbered: new THREE.MeshLambertMaterial({ color: 0xc9b896 }),
    valid: new THREE.MeshLambertMaterial({ color: 0x66bb6a }),
    selected: new THREE.MeshLambertMaterial({ color: 0xff9800 }),
    // Subtle gold for winning alignment — static, no pulse
    winner: new THREE.MeshLambertMaterial({ color: 0xd4b45a }),
    edge: new THREE.LineBasicMaterial({ color: 0x5a4630 }),
    p1: new THREE.MeshLambertMaterial({ color: seats.player1 }),
    p2: new THREE.MeshLambertMaterial({ color: seats.player2 }),
  };

  const padGeo = new THREE.CylinderGeometry(NODE_R, NODE_R, 0.07, 20);
  const chipGeo = new THREE.CylinderGeometry(CHIP_R, CHIP_R * 0.96, CHIP_H, 20);
  const labelGeo = new THREE.CircleGeometry(CHIP_R * 0.92, 20);

  const labelTextures = new Map<string, CanvasTexture>();
  const labelKey = (owner: Player, value: number): string =>
    `${owner}:${value}`;
  const getLabelTexture = (owner: Player, value: number): CanvasTexture => {
    const key = labelKey(owner, value);
    let tex = labelTextures.get(key);
    if (!tex) {
      tex = makeChipNumberTexture(
        THREE,
        value,
        owner === 'player1' ? seats.player1 : seats.player2
      );
      labelTextures.set(key, tex);
    }
    return tex;
  };

  const nodeMeshes = new Map<string, NodeMeshes>();
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const id = `n${row}-${col}`;
      const { x, z } = nodeToWorld(row, col);
      const isNumbered = row === 0 || row === SIZE - 1;
      const pad = new THREE.Mesh(
        padGeo,
        isNumbered ? mats.padNumbered : mats.pad
      );
      pad.position.set(x, PAD_TOP_Y, z);
      pad.userData = { nodeId: id, kind: 'pad', row, col };
      root.add(pad);
      nodeMeshes.set(id, {
        id,
        row,
        col,
        pad,
        chipBody: null,
        chipLabel: null,
        chipValue: null,
        chipOwner: null,
      });
    }
  }

  let edgeLines: LineSegments | null = null;
  let nodeClickHandler: KwatroNodeClickCallback | undefined = onNodeClick;
  let chipClickHandler: KwatroChipClickCallback | undefined = onChipClick;
  let disposed = false;
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
    if (disposed) return;
    const w = Math.max(container.clientWidth || 420, 120);
    const h = Math.max(container.clientHeight || 420, 120);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    paint();
  };

  const buildEdgesOnce = (state: KwaState): void => {
    if (edgeLines) return;
    const positions: number[] = [];
    for (const key of collectPathwayEdgeKeys(state)) {
      const [fromId, toId] = key.split('|');
      if (!fromId || !toId) continue;
      const a = parseKwatroNodeId(fromId);
      const b = parseKwatroNodeId(toId);
      if (!a || !b) continue;
      const wa = nodeToWorld(a.row, a.col);
      const wb = nodeToWorld(b.row, b.col);
      positions.push(wa.x, BOARD_Y + 0.08, wa.z, wb.x, BOARD_Y + 0.08, wb.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    edgeLines = new THREE.LineSegments(geo, mats.edge);
    root.add(edgeLines);
  };

  const pickNodeId = (clientX: number, clientY: number): string | null => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    for (const hit of hits) {
      let obj: Object3D | null = hit.object;
      while (obj) {
        const id = obj.userData?.nodeId as string | undefined;
        if (id) return id;
        obj = obj.parent;
      }
    }

    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const nm of nodeMeshes.values()) {
      const { x, z } = nodeToWorld(nm.row, nm.col);
      projectScratch.set(x, PAD_TOP_Y + CHIP_H, z).project(camera);
      const sx = rect.left + ((projectScratch.x + 1) / 2) * rect.width;
      const sy = rect.top + ((-projectScratch.y + 1) / 2) * rect.height;
      const dx = sx - clientX;
      const dy = sy - clientY;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        bestId = nm.id;
      }
    }
    const maxDist = Math.max(rect.width, rect.height) * 0.07;
    if (bestId && bestDist <= maxDist * maxDist) return bestId;
    return null;
  };

  const onPointer = (event: PointerEvent): void => {
    if (disposed) return;
    if (!nodeClickHandler && !chipClickHandler) return;
    const nodeId = pickNodeId(event.clientX, event.clientY);
    if (!nodeId) return;
    const nm = nodeMeshes.get(nodeId);
    if (!nm) return;
    // Prefer chip selection when a chip is present and selectable via handler
    if (nm.chipBody && chipClickHandler) {
      const chipId = nm.chipBody.userData?.chipId as string | undefined;
      if (chipId) {
        chipClickHandler(chipId);
        return;
      }
    }
    nodeClickHandler?.(nodeId);
  };

  let tearDown: (() => void) | null = null;

  const onContextLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) return;
    tearDown?.();
    container.dispatchEvent(new CustomEvent('mp3d-context-lost'));
  };

  const onResize = (): void => resize();
  const unbindVisibility = bindPageVisibility({
    onVisible: () => paint(),
  });
  canvas.addEventListener('pointerup', onPointer);
  canvas.addEventListener('webglcontextlost', onContextLost);
  window.addEventListener('resize', onResize);

  const clearChip = (nm: NodeMeshes): void => {
    if (nm.chipBody) {
      root.remove(nm.chipBody);
      nm.chipBody = null;
    }
    if (nm.chipLabel) {
      const labelMat = nm.chipLabel.material as {
        dispose?: () => void;
        map?: { dispose?: () => void } | null;
      };
      // Dispose per-chip label material only (shared textures live in labelTextures)
      labelMat.dispose?.();
      root.remove(nm.chipLabel);
      nm.chipLabel = null;
    }
    nm.chipValue = null;
    nm.chipOwner = null;
  };

  const syncChip = (nm: NodeMeshes, chip: Chip | null): void => {
    if (!chip) {
      clearChip(nm);
      return;
    }
    const { x, z } = nodeToWorld(nm.row, nm.col);
    const bodyMat = chip.owner === 'player1' ? mats.p1 : mats.p2;
    const needsRebuild =
      !nm.chipBody ||
      nm.chipValue !== chip.value ||
      nm.chipOwner !== chip.owner;

    if (needsRebuild) {
      clearChip(nm);
      nm.chipBody = new THREE.Mesh(chipGeo, bodyMat);
      nm.chipBody.userData = {
        nodeId: nm.id,
        chipId: chip.id,
        kind: 'chip',
        owner: chip.owner,
      };
      root.add(nm.chipBody);

      const labelMat = new THREE.MeshLambertMaterial({
        map: getLabelTexture(chip.owner, chip.value),
        transparent: true,
      });
      nm.chipLabel = new THREE.Mesh(labelGeo, labelMat);
      nm.chipLabel.rotation.x = -Math.PI / 2;
      nm.chipLabel.userData = {
        nodeId: nm.id,
        chipId: chip.id,
        kind: 'chip-label',
      };
      root.add(nm.chipLabel);
      nm.chipValue = chip.value;
      nm.chipOwner = chip.owner;
    } else if (nm.chipBody) {
      nm.chipBody.material = bodyMat;
      nm.chipBody.userData = {
        ...nm.chipBody.userData,
        nodeId: nm.id,
        chipId: chip.id,
      };
    }

    nm.chipBody!.position.set(x, PAD_TOP_Y + 0.05 + CHIP_H / 2, z);
    nm.chipLabel!.position.set(x, PAD_TOP_Y + 0.05 + CHIP_H + 0.01, z);
  };

  const syncA11y = (state: KwaState): void => {
    const previousFocus = a11y.querySelector(
      '[data-node-id]:focus'
    ) as HTMLElement | null;
    const prevId = previousFocus?.getAttribute('data-node-id') ?? null;
    a11y.replaceChildren();

    const validMoves = state.selectedChip
      ? new Set(getValidMoves(state, state.selectedChip))
      : new Set<string>();

    for (const nm of nodeMeshes.values()) {
      const node = state.nodes.get(nm.id);
      if (!node) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-node-id', nm.id);
      btn.setAttribute('data-row', String(nm.row));
      btn.setAttribute('data-col', String(nm.col));
      btn.style.cssText =
        'width:100%;height:100%;border:0;padding:0;margin:0;background:transparent;pointer-events:none;';

      const isValid = validMoves.has(nm.id) && !node.chip;
      const isWinning = state.winningAlignment?.nodes.includes(nm.id) ?? false;
      const canSelect =
        chipClickHandler != null &&
        node.chip != null &&
        state.phase === 'selectingChip' &&
        node.chip.owner === state.currentPlayer;

      if (node.chip?.owner === 'player2') {
        btn.classList.add('kwa-chip-p2');
      }

      const owner = node.chip
        ? node.chip.owner === 'player1'
          ? 'Blue'
          : 'Red'
        : undefined;
      const piece = node.chip ? `chip ${node.chip.value}` : undefined;

      const labelParts: Parameters<typeof buildCellAriaLabel>[0] = {
        coord: `${nm.row},${nm.col}`,
        empty: !node.chip,
        validMove: isValid,
        extras: [
          node.isNumbered ? 'numbered' : '',
          state.selectedChip && node.chip?.id === state.selectedChip
            ? 'selected'
            : '',
          canSelect ? 'selectable' : '',
          isWinning ? 'winning' : '',
        ].filter(Boolean),
      };
      if (owner !== undefined) labelParts.owner = owner;
      if (piece !== undefined) labelParts.piece = piece;
      makeGridCell(btn, buildCellAriaLabel(labelParts));

      if (canSelect && node.chip) {
        const chipId = node.chip.id;
        btn.classList.add('kwa-selectable-chip');
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        const activate = (): void => chipClickHandler?.(chipId);
        bindCellActivateKeys(btn, activate);
        btn.addEventListener('click', activate);
      } else if (isValid) {
        btn.classList.add('kwa-valid-node');
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        const activate = (): void => nodeClickHandler?.(nm.id);
        bindCellActivateKeys(btn, activate);
        btn.addEventListener('click', activate);
      }

      a11y.appendChild(btn);
    }

    applyRovingTabindex(collectGridCells(a11y));
    if (prevId) {
      const again = a11y.querySelector(
        `[data-node-id="${prevId}"]`
      ) as HTMLElement | null;
      again?.focus();
    }
  };

  const update = (
    state: KwaState,
    nextNodeClick?: KwatroNodeClickCallback,
    nextChipClick?: KwatroChipClickCallback
  ): void => {
    if (disposed) return;
    nodeClickHandler = nextNodeClick;
    chipClickHandler = nextChipClick;
    buildEdgesOnce(state);

    const validMoves = state.selectedChip
      ? new Set(getValidMoves(state, state.selectedChip))
      : new Set<string>();
    const winning = new Set(state.winningAlignment?.nodes ?? []);

    for (const nm of nodeMeshes.values()) {
      const node = state.nodes.get(nm.id);
      if (!node) continue;

      const isNumbered = node.isNumbered;
      let padMat = isNumbered ? mats.padNumbered : mats.pad;
      if (winning.has(nm.id)) padMat = mats.winner;
      else if (validMoves.has(nm.id) && !node.chip) padMat = mats.valid;
      else if (node.chip && state.selectedChip === node.chip.id) {
        padMat = mats.selected;
      }
      nm.pad.material = padMat;

      syncChip(nm, node.chip);
      if (nm.chipBody) {
        const selected = state.selectedChip === node.chip?.id;
        const win = winning.has(nm.id);
        const emphasize = !prefersReducedMotion() && (selected || win);
        const scale = emphasize ? 1.08 : 1;
        nm.chipBody.scale.set(scale, 1, scale);
        if (nm.chipLabel) nm.chipLabel.scale.set(scale, scale, scale);
      }
    }

    syncA11y(state);
    paint();
  };

  const nodeToClientPoint = (
    nodeId: string
  ): { x: number; y: number } | null => {
    const parsed = parseKwatroNodeId(nodeId);
    if (!parsed) return null;
    const { x, z } = nodeToWorld(parsed.row, parsed.col);
    projectScratch.set(x, PAD_TOP_Y + CHIP_H, z).project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  window.__mp3dKwatroSinko = { nodeToClientPoint };

  let cancelMountPaint: () => void = () => undefined;
  const unmount = (): void => {
    if (disposed) return;
    disposed = true;
    cancelMountPaint();
    canvas.removeEventListener('pointerup', onPointer);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    window.removeEventListener('resize', onResize);
    unbindVisibility();
    if (window.__mp3dKwatroSinko) {
      delete window.__mp3dKwatroSinko;
    }
    for (const nm of nodeMeshes.values()) {
      clearChip(nm);
      if (nm.chipLabel?.material) {
        const mat = nm.chipLabel.material as {
          dispose?: () => void;
        };
        mat.dispose?.();
      }
    }
    nodeMeshes.clear();
    while (root.children.length > 0) root.remove(root.children[0]!);
    scene.remove(root);
    padGeo.dispose();
    chipGeo.dispose();
    labelGeo.dispose();
    slabGeo.dispose();
    edgeLines?.geometry.dispose();
    woodMap.dispose();
    for (const tex of labelTextures.values()) tex.dispose();
    labelTextures.clear();
    Object.values(mats).forEach((m) => m.dispose());
    slabMat.dispose();
    rimMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    if (a11y.parentElement) a11y.parentElement.removeChild(a11y);
    container.classList.remove(
      'board-3d-host',
      'kwa-board-3d-host',
      'kwa-board'
    );
  };

  tearDown = unmount;
  resize();
  cancelMountPaint = scheduleBoard3dMountPaint(paint);

  return { update, unmount, nodeToClientPoint, canvas };
}
