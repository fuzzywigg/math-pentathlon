/**
 * Three.js tilted-tabletop 3D board for Star Track.
 *
 * Tablet-friendly (vs Kings #352 weak spots; patterns from FIAR draft #359):
 * - antialias off, pixelRatio capped at TABLET_PIXEL_RATIO_CAP
 * - preserveDrawingBuffer gated; pause paints while the tab is hidden
 * - render-on-demand (no continuous RAF)
 * - full-size host (no fixed 450px cap)
 * - throws when WebGL is unavailable so the controller can keep 2D SVG
 *
 * Interaction stays on DOM chain controls (draw → pick). The canvas shows the
 * star track, seat-colored movers, and engine-derived landing highlights.
 */

import {
  type Player,
  type StarTrackGameState,
  TRACK_LENGTH,
} from '../../games/star-track/types';
import { getChainLandingSpace } from '../../games/star-track/rules';
import {
  fillChainArea,
  type DrawChainsCallback,
  type SelectChainCallback,
  type StarTrackGameMode,
} from '../../games/star-track/board-ui';
import type { CssRect } from '../coord-map';
import { getPlayerSeatColors } from '../player-colors';
import { prefersReducedMotion } from '../reduced-motion';
import { loadThree, type ThreeModule } from './load-three';
import {
  resolveBoard3dPixelRatio,
  paintBoard3dAndMarkReady,
  scheduleBoard3dMountPaint,
  bindPageVisibility,
  shouldPreserveDrawingBuffer,
  syncBoard3dRendererSize,
  bindBoard3dLayout,
  resolveCssViewportSize,
} from './tablet-gl';

type Three = ThreeModule;
type Mesh = InstanceType<Three['Mesh']>;
type Material = InstanceType<Three['MeshLambertMaterial']>;

const TRACK_HALF = 5.4;
const SPACE_R = 0.22;
const PIECE_R = 0.28;
const PIECE_H = 0.36;
const BOARD_Y = 0;

export interface StarTrackBoard3DCallbacks {
  onDrawChains?: DrawChainsCallback | undefined;
  onSelectChain?: SelectChainCallback | undefined;
  /** Winner-banner labels (You/AI vs Blue/Red). */
  gameMode?: StarTrackGameMode | undefined;
}

export interface StarTrackBoard3D {
  update(
    state: StarTrackGameState,
    callbacks?: StarTrackBoard3DCallbacks
  ): void;
  unmount(): void;
  spaceToClientPoint(
    player: Player,
    space: number
  ): { x: number; y: number } | null;
  readonly canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    __mp3dStarTrack?: {
      spaceToClientPoint: (
        player: Player,
        space: number
      ) => { x: number; y: number } | null;
    };
  }
}

function spaceToWorld(player: Player, space: number): { x: number; z: number } {
  const t = Math.min(Math.max(space, 0), TRACK_LENGTH) / TRACK_LENGTH;
  // P1 from -Z (top) toward center; P2 from +Z (bottom) toward center.
  // Slight X offset so both pieces remain readable when near the goal.
  const startZ = player === 'player1' ? -TRACK_HALF : TRACK_HALF;
  const lateral = player === 'player1' ? -0.35 : 0.35;
  return {
    x: lateral * (1 - t),
    z: startZ * (1 - t),
  };
}

/**
 * Create and mount a 3D Star Track board into `container`.
 * Rejects when WebGL is unavailable so callers can fall back to 2D SVG.
 */
export async function createStarTrackBoard3D(
  container: HTMLElement,
  onContextLost?: () => void
): Promise<StarTrackBoard3D> {
  const THREE = await loadThree();

  container.replaceChildren();
  container.classList.add('board-3d-host', 'star-track-board-3d-host');

  // Game-local layout styles (avoid editing shared style.css).
  // Landscape short viewports put chain controls beside the canvas so they
  // stay above the fold on phone/tablet sizes from the acceptance matrix.
  {
    let style = document.getElementById('star-track-3d-layout-css');
    if (!style) {
      style = document.createElement('style');
      style.id = 'star-track-3d-layout-css';
      document.head.appendChild(style);
    }
    // Always refresh so Vite HMR / remounts do not keep a stale max-height.
    style.textContent = `
      .star-track-3d-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 100%;
      }
      .star-track-3d-canvas-host {
        position: relative;
        width: min(100%, 560px, 70vmin);
        max-width: 100%;
        aspect-ratio: 1;
        max-height: min(560px, 70vmin);
        margin: 0 auto;
      }
      @media (orientation: landscape) and (max-height: 820px) {
        .star-track-3d-layout {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }
        .star-track-3d-canvas-host {
          width: min(52vh, 100%);
          max-height: 52vh;
        }
        .star-track-3d-layout > .star-track-chain-area {
          flex: 1 1 180px;
          max-width: 320px;
        }
      }
    `;
  }

  const layout = document.createElement('div');
  layout.className = 'star-track-3d-layout';
  container.appendChild(layout);

  const canvasHost = document.createElement('div');
  canvasHost.className = 'star-track-3d-canvas-host';
  layout.appendChild(canvasHost);

  const chainArea = document.createElement('div');
  chainArea.className = 'star-track-chain-area';
  layout.appendChild(chainArea);

  const scene = new THREE.Scene();
  // Night-sky tabletop atmosphere (original procedural look)
  scene.background = new THREE.Color(0x0c1424);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 10.6, 9.2);
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
      `WebGLRenderer failed — Star Track 3D board cannot mount (${
        err instanceof Error ? err.message : 'unknown'
      })`
    );
  }
  renderer.setPixelRatio(resolveBoard3dPixelRatio());
  const canvas = renderer.domElement;
  canvas.className = 'board-3d-canvas';
  canvas.setAttribute('data-mp3d', 'star-track');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Star Track 3D board');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  canvasHost.appendChild(canvas);

  // Visually-hidden a11y track — focus highlights the matching 3D space
  const a11y = document.createElement('div');
  a11y.className = 'star-track-a11y-track';
  a11y.setAttribute('role', 'group');
  a11y.setAttribute('aria-label', 'Star Track spaces');
  a11y.style.cssText =
    'position:absolute;inset:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);width:1px;height:1px;white-space:nowrap;';
  canvasHost.appendChild(a11y);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xdce8ff, 0x1a2030, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6e8, 0.8);
  key.position.set(4, 14, 3);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  // Raised tabletop slab
  const slabGeo = new THREE.BoxGeometry(12.2, 0.2, 12.2);
  const slabMat = new THREE.MeshLambertMaterial({ color: 0x152238 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.position.y = BOARD_Y - 0.14;
  root.add(slab);

  // Soft rim
  const rimMat = new THREE.MeshLambertMaterial({ color: 0x2a4060 });
  const rimEdgeGeos: InstanceType<Three['BoxGeometry']>[] = [];
  for (const [x, z, sx, sz] of [
    [0, -5.95, 12.2, 0.28],
    [0, 5.95, 12.2, 0.28],
    [-5.95, 0, 0.28, 12.2],
    [5.95, 0, 0.28, 12.2],
  ] as const) {
    const edgeGeo = new THREE.BoxGeometry(sx, 0.08, sz);
    rimEdgeGeos.push(edgeGeo);
    const edge = new THREE.Mesh(edgeGeo, rimMat);
    edge.position.set(x, BOARD_Y - 0.02, z);
    root.add(edge);
  }

  const seats = getPlayerSeatColors();
  const mats = {
    space: new THREE.MeshLambertMaterial({ color: 0xf2f4f8 }),
    spaceStart: new THREE.MeshLambertMaterial({ color: 0xd7e3f5 }),
    spaceGoal: new THREE.MeshLambertMaterial({ color: 0xffe082 }),
    spaceLast: new THREE.MeshLambertMaterial({ color: 0x81d4fa }),
    spaceTarget: new THREE.MeshLambertMaterial({ color: 0x81c784 }),
    spaceTargetFocus: new THREE.MeshLambertMaterial({ color: 0xffb74d }),
    spaceFocus: new THREE.MeshLambertMaterial({ color: 0xce93d8 }),
    p1Track: new THREE.MeshLambertMaterial({ color: 0x3d5a80 }),
    p2Track: new THREE.MeshLambertMaterial({ color: 0x5c3d4a }),
    p1: new THREE.MeshLambertMaterial({ color: seats.player1 }),
    p2: new THREE.MeshLambertMaterial({ color: seats.player2 }),
    star: new THREE.MeshLambertMaterial({ color: 0xffd54f }),
    ray: new THREE.MeshLambertMaterial({ color: 0x4a6080 }),
  };

  const spaceGeo = new THREE.CylinderGeometry(SPACE_R, SPACE_R, 0.08, 16);
  const pieceGeo = new THREE.CylinderGeometry(
    PIECE_R,
    PIECE_R * 0.85,
    PIECE_H,
    20
  );
  const starGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 5);
  const trackGeo = new THREE.BoxGeometry(0.55, 0.06, TRACK_HALF);

  // Track beds
  const p1Track = new THREE.Mesh(trackGeo, mats.p1Track);
  p1Track.position.set(-0.18, BOARD_Y + 0.02, -TRACK_HALF / 2);
  root.add(p1Track);
  const p2Track = new THREE.Mesh(trackGeo, mats.p2Track);
  p2Track.position.set(0.18, BOARD_Y + 0.02, TRACK_HALF / 2);
  root.add(p2Track);

  // Center star goal
  const star = new THREE.Mesh(starGeo, mats.star);
  star.position.set(0, BOARD_Y + 0.08, 0);
  star.rotation.y = Math.PI / 10;
  root.add(star);

  // Decorative rays (visual only) — shared geometry
  const rayGeo = new THREE.BoxGeometry(0.08, 0.04, 2.2);
  for (let i = 0; i < 5; i++) {
    const angle = ((i * 72 - 90) * Math.PI) / 180;
    const ray = new THREE.Mesh(rayGeo, mats.ray);
    ray.position.set(
      Math.cos(angle) * 1.3,
      BOARD_Y + 0.04,
      Math.sin(angle) * 1.3
    );
    ray.rotation.y = -angle;
    root.add(ray);
  }

  interface SpaceMesh {
    player: Player;
    space: number;
    pad: Mesh;
  }

  const spaceMeshes: SpaceMesh[] = [];
  for (const player of ['player1', 'player2'] as const) {
    for (let space = 0; space <= TRACK_LENGTH; space++) {
      // Shared goal pad drawn once at center (player1 ownership for picking)
      if (space === TRACK_LENGTH && player === 'player2') {
        continue;
      }
      const { x, z } = spaceToWorld(player, space);
      const pad = new THREE.Mesh(spaceGeo, mats.space);
      pad.position.set(
        space === TRACK_LENGTH ? 0 : x,
        BOARD_Y + 0.06,
        space === TRACK_LENGTH ? 0 : z
      );
      pad.userData = { player, space, kind: 'space' };
      root.add(pad);
      spaceMeshes.push({ player, space, pad });
    }
  }

  let p1Piece: Mesh | null = null;
  let p2Piece: Mesh | null = null;
  let previewIndex: 0 | 1 | null = null;
  let a11yFocus: { player: Player; space: number } | null = null;
  let latestState: StarTrackGameState | null = null;
  let disposed = false;
  const projectScratch = new THREE.Vector3();

  const paint = (): void => {
    paintBoard3dAndMarkReady(
      canvas,
      () => renderer.render(scene, camera),
      () => disposed
    );
  };

  /**
   * Cached canvas CSS box for project (role C). Invalidated on layout;
   * lazy-seeded on first spaceToClientPoint so hooks do not force geometry
   * when the rect is still warm.
   */
  let canvasCssRect: CssRect | null = null;

  /** Sole canvas geometry read — keep forced layout funneled here. */
  const measureCanvasCssRect = (): CssRect => {
    const r = canvas.getBoundingClientRect();
    canvasCssRect = {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
    };
    return canvasCssRect;
  };

  const getCanvasCssRect = (): CssRect =>
    canvasCssRect ?? measureCanvasCssRect();

  /** Sole layout geometry read for viewport fit (role D). */
  const measureLayoutCssTop = (): number => layout.getBoundingClientRect().top;

  /**
   * Size the canvas from remaining viewport below the board host so the
   * chain controls stay above the fold on phone + both tablet orientations.
   * Returns the authored CSS side (px) so resize can sync the renderer
   * without a write-then-read host-box reflow.
   */
  const fitHostToViewport = (): number => {
    layout.style.flexDirection = 'column';
    layout.style.flexWrap = 'nowrap';
    layout.style.justifyContent = 'center';
    chainArea.style.flex = '';
    chainArea.style.maxWidth = '';

    const top = measureLayoutCssTop();
    // Budget for draw / choose-chain / taller game-over winner block under a
    // top-aligned shell (menu CLS fix). 180 was enough when body was centered.
    const chainBudget = 230;
    const { width: vw, height: vh } = resolveCssViewportSize();
    const available = Math.max(120, vh - top - chainBudget - 12);
    const side = Math.max(140, Math.min(vw * 0.92, available, 520));
    canvasHost.style.width = `${side}px`;
    canvasHost.style.height = `${side}px`;
    canvasHost.style.maxHeight = `${side}px`;
    return side;
  };

  const resize = (): void => {
    if (disposed) {
      return;
    }
    // Invalidate only — next project re-measures (lazy seed). Seeding here
    // would lock a pre-layout zero box in jsdom before tests stub canvas CSS.
    canvasCssRect = null;
    const side = fitHostToViewport();
    const w = Math.max(side, 120);
    const h = Math.max(side, 120);
    syncBoard3dRendererSize(renderer, camera, w, h);
    paint();
  };

  const unbindVisibility = bindPageVisibility({
    onVisible: () => paint(),
  });
  const unbindLayout = bindBoard3dLayout(canvasHost, () => resize());

  const onLost = (event: Event): void => {
    event.preventDefault();
    if (disposed) {
      return;
    }
    onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  const ensurePiece = (player: Player): Mesh => {
    if (player === 'player1') {
      if (!p1Piece) {
        p1Piece = new THREE.Mesh(pieceGeo, mats.p1);
        p1Piece.userData = { player, kind: 'piece' };
        root.add(p1Piece);
      }
      return p1Piece;
    }
    if (!p2Piece) {
      p2Piece = new THREE.Mesh(pieceGeo, mats.p2);
      p2Piece.userData = { player, kind: 'piece' };
      root.add(p2Piece);
    }
    return p2Piece;
  };

  const syncA11y = (): void => {
    a11y.replaceChildren();
    for (const player of ['player1', 'player2'] as const) {
      for (let space = 0; space <= TRACK_LENGTH; space++) {
        if (space === TRACK_LENGTH && player === 'player2') {
          continue;
        }
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'button');
        btn.setAttribute('data-player', player);
        btn.setAttribute('data-space', String(space));
        const labelPlayer = player === 'player1' ? 'Blue track' : 'Red track';
        btn.setAttribute(
          'aria-label',
          space === TRACK_LENGTH
            ? 'Center star goal'
            : `${labelPlayer} space ${space}`
        );
        btn.tabIndex = space === 0 && player === 'player1' ? 0 : -1;
        btn.addEventListener('focus', () => {
          a11yFocus = { player, space };
          if (latestState) {
            applyHighlights(latestState);
          }
          paint();
        });
        btn.addEventListener('blur', () => {
          if (a11yFocus?.player === player && a11yFocus.space === space) {
            a11yFocus = null;
            if (latestState) {
              applyHighlights(latestState);
            }
            paint();
          }
        });
        a11y.appendChild(btn);
      }
    }
  };

  const applyHighlights = (state: StarTrackGameState): void => {
    const last = state.moveHistory[state.moveHistory.length - 1];
    const land0 = getChainLandingSpace(state, 0);
    const land1 = getChainLandingSpace(state, 1);
    const focusLand =
      previewIndex === 0 ? land0 : previewIndex === 1 ? land1 : null;
    const current = state.currentPlayer;

    for (const sm of spaceMeshes) {
      let mat: Material = mats.space;
      if (sm.space === TRACK_LENGTH) {
        mat = mats.spaceGoal;
      } else if (sm.space === 0) {
        mat = mats.spaceStart;
      }

      if (
        last?.player === sm.player &&
        (last.toPosition === sm.space ||
          (sm.space === TRACK_LENGTH && last.toPosition >= TRACK_LENGTH))
      ) {
        mat = mats.spaceLast;
      }

      // Engine-derived targets for both drawn chains
      if (
        state.phase === 'selectChain' &&
        sm.player === current &&
        (sm.space === land0 || sm.space === land1)
      ) {
        mat = mats.spaceTarget;
      }
      if (
        focusLand !== null &&
        sm.player === current &&
        sm.space === focusLand
      ) {
        mat = mats.spaceTargetFocus;
      }

      if (
        a11yFocus &&
        ((sm.space === TRACK_LENGTH && a11yFocus.space === TRACK_LENGTH) ||
          (sm.player === a11yFocus.player && sm.space === a11yFocus.space))
      ) {
        mat = mats.spaceFocus;
      }

      if (state.winner && sm.space === TRACK_LENGTH) {
        mat = mats.spaceGoal;
      }

      sm.pad.material = mat;
    }
  };

  const update = (
    state: StarTrackGameState,
    callbacks?: StarTrackBoard3DCallbacks
  ): void => {
    if (disposed) {
      return;
    }
    latestState = state;

    const placePiece = (player: Player, space: number): void => {
      const piece = ensurePiece(player);
      const { x, z } =
        space >= TRACK_LENGTH
          ? { x: player === 'player1' ? -0.22 : 0.22, z: 0 }
          : spaceToWorld(player, space);
      piece.position.set(x, BOARD_Y + 0.08 + PIECE_H / 2, z);
      piece.material = player === 'player1' ? mats.p1 : mats.p2;
      const won = state.winner === player && !prefersReducedMotion();
      piece.scale.set(won ? 1.12 : 1, won ? 1.15 : 1, won ? 1.12 : 1);
    };

    placePiece('player1', state.player1Position);
    placePiece('player2', state.player2Position);

    applyHighlights(state);

    fillChainArea(
      chainArea,
      state,
      callbacks?.onDrawChains,
      callbacks?.onSelectChain,
      (index) => {
        previewIndex = index;
        applyHighlights(state);
        paint();
      },
      {
        ...(callbacks?.gameMode !== undefined
          ? { gameMode: callbacks.gameMode }
          : {}),
      }
    );

    if (a11y.childElementCount === 0) {
      syncA11y();
    }

    // Re-fit after status/chain height changes (e.g. game-over winner block).
    resize();
  };

  const spaceToClientPoint = (
    player: Player,
    space: number
  ): { x: number; y: number } | null => {
    if (disposed) {
      return null;
    }
    const { x, z } =
      space >= TRACK_LENGTH ? { x: 0, z: 0 } : spaceToWorld(player, space);
    projectScratch.set(x, BOARD_Y + 0.2, z).project(camera);
    const rect = getCanvasCssRect();
    return {
      x: rect.left + ((projectScratch.x + 1) / 2) * rect.width,
      y: rect.top + ((-projectScratch.y + 1) / 2) * rect.height,
    };
  };

  window.__mp3dStarTrack = { spaceToClientPoint };

  let cancelMountPaint: () => void = () => undefined;
  const unmount = (): void => {
    if (disposed) {
      return;
    }
    disposed = true;
    cancelMountPaint();
    unbindVisibility();
    unbindLayout();
    canvas.removeEventListener('webglcontextlost', onLost);
    if (window.__mp3dStarTrack) {
      delete window.__mp3dStarTrack;
    }
    while (root.children.length > 0) {
      const child = root.children[0];
      if (child === undefined) {
        break;
      }
      root.remove(child);
    }
    scene.remove(root);
    spaceGeo.dispose();
    pieceGeo.dispose();
    starGeo.dispose();
    trackGeo.dispose();
    slabGeo.dispose();
    rayGeo.dispose();
    rimEdgeGeos.forEach((g) => g.dispose());
    Object.values(mats).forEach((m) => m.dispose());
    slabMat.dispose();
    rimMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
    layout.remove();
    container.classList.remove('board-3d-host', 'star-track-board-3d-host');
  };

  resize();
  cancelMountPaint = scheduleBoard3dMountPaint(paint);

  return { update, unmount, spaceToClientPoint, canvas };
}
