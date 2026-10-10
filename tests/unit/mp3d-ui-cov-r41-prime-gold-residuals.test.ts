/**
 * q-mp-470 / UI coverage round 41 — Prime Gold board-3d residual arms
 * (coldest `src/ui/three` file on tip post914). Characterization only;
 * no AI choice, timing, copy-body, or product `src/` edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState } from '../../src/games/prime-gold/rules';
import type { BoardCell, PrimeGoldState } from '../../src/games/prime-gold/types';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

function ownPrimeDiagonal(
  state: PrimeGoldState,
  cells: ReadonlyArray<readonly [number, number]>,
  owner: BoardCell['owner']
): void {
  for (const [row, col] of cells) {
    const cell = state.cells.get(`${row},${col}`);
    if (!cell) {
      continue;
    }
    state.cells.set(`${row},${col}`, {
      ...cell,
      isPrime: true,
      owner,
    });
  }
}

describe('q-mp-470 ui-cov-r41 prime-gold residuals', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dPrimeGold?: unknown }).__mp3dPrimeGold;
  });

  it('parseCssColor catch + SRGB label texture + null 2d ctx soft path', async () => {
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

  it('veins / focus / valid / last mats + chip reuse + missing-cell arms', async () => {
    const three = installThreeMock();
    Object.assign(three, { SRGBColorSpace: 'srgb' });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPrimeGoldBoard3D(host);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    ownPrimeDiagonal(
      state,
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      'player1'
    );
    ownPrimeDiagonal(
      state,
      [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
      ],
      'player2'
    );
    // Chip material reuse arm: flip an owned cell's seat on second update.
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

    // Missing-cell arms after meshes already built.
    state.cells.delete('0,0');
    board.update(state);

    expect(host.querySelector('.pg-a11y-grid')).toBeTruthy();
    board.unmount();
  });

  it('pointer placing hits / miss / zero-rect / non-placing / disposed', async () => {
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
    expect(onCell).toHaveBeenCalledWith(7, expect.any(String));

    onCell.mockClear();
    dispatchTap(board.canvas);
    // Value 99999 is not a valid placement → early return without call.
    expect(onCell).not.toHaveBeenCalled();

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
    // Invalidate cached CSS rect so the zero box is re-measured.
    window.dispatchEvent(new Event('resize'));
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    stubCanvasLayout(board.canvas);
    window.dispatchEvent(new Event('resize'));
    board.update(createInitialState(), onCell); // phase rolling
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    board.unmount();
    stubCanvasLayout(board.canvas);
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();
  });

  it('OOB hooks + post-dispose resize/update + double context-lost', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const lost = vi.fn();
    host.addEventListener('mp3d-context-lost', lost);
    const board = await createPrimeGoldBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());

    expect(board.cellToClientPoint(-1, 0)).toBeNull();
    expect(board.cellToClientPoint(0, 99)).toBeNull();
    expect(board.valueToClientPoint(999_999)).toBeNull();
    expect(board.valueToClientPoint(1)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    const event = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(event);
    expect(lost).toHaveBeenCalledTimes(1);

    // Second lost after dispose is quiet (onContextLost disposed guard).
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
    expect(lost).toHaveBeenCalledTimes(1);

    board.update(createInitialState());
    window.dispatchEvent(new Event('resize'));
    board.unmount();
  });
});
