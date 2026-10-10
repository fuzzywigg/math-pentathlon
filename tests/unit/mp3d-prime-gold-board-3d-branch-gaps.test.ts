/**
 * q-mp-610 — close `prime-gold-board-3d` branch gaps (tests-only).
 *
 * Characterization / chrome only: element presence, class/attribute chrome,
 * render-call counts. No AI move-choice / timing / scoring / legal-move
 * outcome asserts; no copy / aria / label text pins; no product `src/` edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState } from '../../src/games/prime-gold/rules';
import type {
  BoardCell,
  PrimeGoldState,
} from '../../src/games/prime-gold/types';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

function ownCell(
  state: PrimeGoldState,
  row: number,
  col: number,
  owner: BoardCell['owner'],
  isPrime = true
): void {
  const cell = state.cells.get(`${row},${col}`);
  if (!cell) {
    return;
  }
  state.cells.set(`${row},${col}`, { ...cell, owner, isPrime });
}

describe('q-mp-610 prime-gold-board-3d branch gaps', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
    // Default: real rules (state setup only). Individual cases may override.
    vi.doMock('../../src/games/prime-gold/rules', async (importOriginal) =>
      importOriginal<typeof import('../../src/games/prime-gold/rules')>()
    );
    vi.doMock('../../src/ui/three/tablet-gl', async (importOriginal) =>
      importOriginal<typeof import('../../src/ui/three/tablet-gl')>()
    );
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dPrimeGold?: unknown }).__mp3dPrimeGold;
  });

  it('pointer placing hit / miss / zero-rect / non-placing arms', async () => {
    const parent = {
      userData: { value: 7, kind: 'tile' },
      parent: null as unknown,
    };
    const child = { userData: {}, parent };
    const dead = { userData: { value: 99999, kind: 'tile' }, parent: null };
    const hitQueue = [
      [{ object: child }],
      [{ object: dead }],
      [{ object: child }],
      [{ object: child }],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createPrimeGoldBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);

    const placing = createInitialState();
    placing.phase = 'placing';
    placing.diceRoll = { die1: 2, die2: 3, die3: 5 };
    board.update(placing, onCell);

    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalled();
    const callsAfterHit = onCell.mock.calls.length;

    dispatchTap(board.canvas);
    // Dead value → no additional handler call (chrome only).
    expect(onCell.mock.calls.length).toBe(callsAfterHit);

    vi.spyOn(board.canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    window.dispatchEvent(new Event('resize'));
    dispatchTap(board.canvas);
    expect(onCell.mock.calls.length).toBe(callsAfterHit);

    stubCanvasLayout(board.canvas);
    window.dispatchEvent(new Event('resize'));
    board.update(createInitialState(), onCell); // rolling → non-placing
    dispatchTap(board.canvas);
    expect(onCell.mock.calls.length).toBe(callsAfterHit);

    board.unmount();
    dispatchTap(board.canvas);
    expect(onCell.mock.calls.length).toBe(callsAfterHit);
  });

  it('parseCssColor catch + null 2d ctx + SRGB label texture soft path', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(function (
      this: HTMLCanvasElement,
      type: string
    ) {
      if (type === '2d') {
        return null;
      }
      return {};
    }) as never;

    const three = installThreeMock();
    Object.assign(three, { SRGBColorSpace: 'srgb' });
    three.Color = class {
      hex?: number | string;
      constructor(hex?: number | string) {
        this.hex = hex;
      }
      set(hex: number | string) {
        if (typeof hex === 'string') {
          throw new Error('css parse fail');
        }
        this.hex = hex;
        return this;
      }
      clone() {
        return new three.Color(this.hex);
      }
      lerp() {
        return this;
      }
      multiplyScalar() {
        return this;
      }
    } as typeof three.Color;

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());
    expect(host.querySelector('canvas[data-mp3d="prime-gold"]')).toBeTruthy();
    board.unmount();
  });

  it('veins / focus / last / chip seat flip chrome arms', async () => {
    const three = installThreeMock();
    Object.assign(three, { SRGBColorSpace: 'srgb' });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    // Real vein segments (≥4 primes) so tileVein / veinLine player arms run.
    vi.doMock('../../src/games/prime-gold/rules', async (importOriginal) =>
      importOriginal<typeof import('../../src/games/prime-gold/rules')>()
    );

    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    for (const [row, col] of [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ] as const) {
      ownCell(state, row, col, 'player1');
    }
    for (const [row, col] of [
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ] as const) {
      ownCell(state, row, col, 'player2');
    }
    const flip = state.cells.get('4,4');
    if (flip) {
      state.cells.set('4,4', { ...flip, owner: 'player1' });
    }
    state.phase = 'placing';
    state.diceRoll = { die1: 2, die2: 3, die3: 5 };
    state.moveHistory = [
      {
        player: 'player1',
        dice: { die1: 1, die2: 1, die3: 1 },
        expression: '1',
        result: 31,
        row: 6,
        col: 6,
      },
    ];
    board.update(state);

    const flip2 = state.cells.get('4,4');
    if (flip2) {
      state.cells.set('4,4', { ...flip2, owner: 'player2' });
    }
    board.update(state);

    const focusBtn = host.querySelector(
      '.pg-a11y-grid button[data-value="31"]'
    ) as HTMLButtonElement | null;
    expect(focusBtn).toBeTruthy();
    focusBtn!.focus();
    board.update(state);

    expect(host.querySelector('.pg-a11y-grid')).toBeTruthy();
    board.unmount();
  });

  it('OOB / missing-value hooks + update-after-dispose no-op', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());

    expect(board.cellToClientPoint(-1, 0)).toBeNull();
    expect(board.cellToClientPoint(0, 99)).toBeNull();
    expect(board.valueToClientPoint(999_999)).toBeNull();
    expect(board.cellToClientPoint(0, 0)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    board.unmount();
    board.update(createInitialState());
    expect(host.querySelector('canvas[data-mp3d="prime-gold"]')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
  });

  it('domElement getContext fallback + non-Error mount failure message', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio() {}
      setSize() {}
      render() {}
      dispose() {}
      forceContextLoss() {}
      // no getContext on renderer → falls through to domElement.getContext
    } as typeof three.WebGLRenderer;

    const getContext = vi.spyOn(
      HTMLCanvasElement.prototype,
      'getContext'
    ) as unknown as ReturnType<typeof vi.spyOn>;
    getContext.mockImplementation(function (
      this: HTMLCanvasElement,
      type: string
    ) {
      if (type === '2d') {
        return {
          clearRect: vi.fn(),
          fillRect: vi.fn(),
          beginPath: vi.fn(),
          arc: vi.fn(),
          fill: vi.fn(),
          fillText: vi.fn(),
          createRadialGradient: () => ({ addColorStop: vi.fn() }),
        };
      }
      if (type === 'webgl') {
        return null;
      }
      if (type === 'experimental-webgl') {
        return {};
      }
      return null;
    });

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="prime-gold"]')).toBeTruthy();
    board.unmount();

    // Non-Error throw → "unknown" arm in mount catch.
    vi.resetModules();
    installCanvas2dStub();
    const threeFail = installThreeMock();
    threeFail.WebGLRenderer = class {
      constructor() {
        throw 'mount-boom';
      }
    } as typeof threeFail.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeFail,
    }));
    const mod = await import('../../src/ui/three/prime-gold-board-3d');
    await expect(
      mod.createPrimeGoldBoard3D(document.createElement('div'))
    ).rejects.toThrow(/unknown/);
  });

  it('missing-cell build skip + short/sparse vein segments + a11y chrome arms', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    vi.doMock('../../src/games/prime-gold/rules', async (importOriginal) => {
      const actual =
        await importOriginal<
          typeof import('../../src/games/prime-gold/rules')
        >();
      return {
        ...actual,
        getPrimeVeinSegments: (
          _cells: Map<string, BoardCell>,
          player: 'player1' | 'player2'
        ) => {
          if (player === 'player1') {
            // length < 2 → syncVeins continue arm
            return [[{ row: 0, col: 0 }]];
          }
          // Index hole for syncVeins segA/segB guard; iterator skips holes so
          // applyHighlights' for...of does not see undefined cells.
          const cellA = { row: 1, col: 1 };
          const sparse = {
            length: 2,
            0: cellA,
            1: undefined as { row: number; col: number } | undefined,
            [Symbol.iterator]: function* iterator() {
              yield cellA;
            },
          };
          return [sparse as unknown as { row: number; col: number }[]];
        },
      };
    });

    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createPrimeGoldBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    // Hole on first build → !cell continue in buildCellsFromState.
    state.cells.delete('0,0');
    state.phase = 'placing';
    state.diceRoll = { die1: 2, die2: 3, die3: 5 };
    ownCell(state, 1, 1, 'player1');
    board.update(state, onCell);

    expect(host.querySelector('.pg-a11y-grid')).toBeTruthy();
    expect(host.querySelector('.pg-a11y-grid button[data-value]')).toBeTruthy();

    // a11y click path (handler call count only — no expr / legality pin).
    const focusable = host.querySelector(
      '.pg-a11y-grid button[tabindex="0"]'
    ) as HTMLButtonElement | null;
    expect(focusable).toBeTruthy();
    focusable!.click();
    expect(onCell).toHaveBeenCalled();

    // firstFocusable && activeElement === body arm on next syncA11y.
    const activeSpy = vi
      .spyOn(document, 'activeElement', 'get')
      .mockReturnValue(document.body);
    board.update(state, onCell);
    activeSpy.mockRestore();

    // Empty a11y buttons → !first querySelector('button') arm.
    for (const key of [...state.cells.keys()]) {
      state.cells.delete(key);
    }
    board.update(state, onCell);
    expect(host.querySelector('.pg-a11y-grid button')).toBeNull();

    board.unmount();
  });

  it('pointer without state, visibility paint, disposed resize/contextlost, sparse unmount', async () => {
    // Ensure prior rules mock does not leak into this case.
    vi.doMock('../../src/games/prime-gold/rules', async (importOriginal) =>
      importOriginal<typeof import('../../src/games/prime-gold/rules')>()
    );

    let resizeCb: (() => void) | null = null;
    vi.doMock('../../src/ui/three/tablet-gl', async (importOriginal) => {
      const mod =
        await importOriginal<typeof import('../../src/ui/three/tablet-gl')>();
      return {
        ...mod,
        bindBoard3dLayout: (host: HTMLElement, onLayout: () => void) => {
          resizeCb = onLayout;
          return mod.bindBoard3dLayout(host, onLayout);
        },
      };
    });

    let contextLostHandler: EventListener | null = null;
    const addListener = HTMLCanvasElement.prototype.addEventListener;
    vi.spyOn(
      HTMLCanvasElement.prototype,
      'addEventListener'
    ).mockImplementation(function (
      this: HTMLCanvasElement,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      if (type === 'webglcontextlost' && typeof listener === 'function') {
        contextLostHandler = listener;
      }
      return addListener.call(this, type, listener, options);
    });

    const three = installThreeMock();
    // Sparse children teardown: leave a hole so unmount hits child === undefined.
    const BaseGroup = three.Group;
    three.Group = class extends BaseGroup {
      remove(child: InstanceType<typeof BaseGroup>) {
        const i = this.children.indexOf(child);
        if (i >= 0) {
          delete this.children[i];
          child.parent = null;
        }
      }
    } as typeof three.Group;

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createPrimeGoldBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);

    // Tap before any update → !lastState early return (pointer still bound).
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    board.update(createInitialState(), onCell);
    expect(host.querySelector('canvas[data-mp3d="prime-gold"]')).toBeTruthy();
    expect(contextLostHandler).toBeTypeOf('function');

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    const lost = vi.fn();
    host.addEventListener('mp3d-context-lost', lost);

    // Pre-clear hook + detach a11y so unmount hits falsy __mp3d / parent arms.
    delete (window as Window & { __mp3dPrimeGold?: unknown }).__mp3dPrimeGold;
    host.querySelector('.pg-a11y-grid')?.remove();

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();

    // Disposed guard on captured context-lost handler (listener already removed).
    const quiet = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    contextLostHandler!(quiet);
    expect(quiet.defaultPrevented).toBe(true);
    expect(lost).not.toHaveBeenCalled();

    // Captured layout cb after dispose → resize early return.
    resizeCb?.();
    board.update(createInitialState());
  });
});
