import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { DiceRoll, PrimeGoldState } from '../../src/games/prime-gold/types';
import { generateExpressions } from '../../src/games/prime-gold/types';

const isBoard3dEnabled = vi.fn(() => true);
const loadPrimeGoldBoard3DModule = vi.fn();

/** value → one dice triple that can produce it (built once). */
const diceForValue = new Map<number, DiceRoll>();
function ensureDiceCache(): void {
  if (diceForValue.size > 0) return;
  for (let d1 = 1; d1 <= 6; d1++) {
    for (let d2 = 1; d2 <= 8; d2++) {
      for (let d3 = 1; d3 <= 10; d3++) {
        for (const e of generateExpressions(d1, d2, d3)) {
          if (!diceForValue.has(e.value)) {
            diceForValue.set(e.value, { die1: d1, die2: d2, die3: d3 });
          }
        }
      }
    }
  }
}

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/prime-gold/board-3d-loader', () => ({
  loadPrimeGoldBoard3DModule: () => loadPrimeGoldBoard3DModule(),
}));

vi.mock('../../src/games/prime-gold/rules', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/games/prime-gold/rules')>();

  const rollDice = (state: PrimeGoldState): PrimeGoldState => {
    if (state.phase !== 'rolling') return state;
    ensureDiceCache();

    for (let value = 1; value <= 49; value++) {
      const cell = actual.findCellByValue(state, value);
      if (!cell || cell.owner) continue;
      const dice = diceForValue.get(value);
      if (!dice) continue;
      return {
        ...state,
        diceRoll: dice,
        phase: 'placing',
      };
    }

    return {
      ...state,
      diceRoll: { die1: 1, die2: 1, die3: 1 },
      phase: 'placing',
    };
  };

  return {
    ...actual,
    rollDice,
  };
});

describe('mp3d Prime Gold scripted full game vs AI (3D mocked)', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReturnValue(true);
    loadPrimeGoldBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
    vi.useFakeTimers();

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'prime-gold');
    loadPrimeGoldBoard3DModule.mockResolvedValue({
      createPrimeGoldBoard3D: async (container: HTMLElement) => {
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update: vi.fn(),
          unmount: vi.fn(() => fakeCanvas.remove()),
          cellToClientPoint: () => ({ x: 0, y: 0 }),
          valueToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/prime-gold/game-controller');
      destroyGame();
    } catch {
      // ignore
    }
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(['easy', 'medium', 'hard'] as const)(
    'plays to game over vs AI (%s) with 3D path selected',
    async (difficulty) => {
      const { initGame, whenBoard3dReady, isUsingBoard3d, getGameState } =
        await import('../../src/games/prime-gold/game-controller');

      const board = document.createElement('div');
      document.body.append(board);
      const controller = initGame(board, true, difficulty);
      await whenBoard3dReady();
      expect(isUsingBoard3d()).toBe(true);

      for (let step = 0; step < 120; step++) {
        const state = getGameState();
        if (!state || state.phase === 'gameOver') break;

        if (state.currentPlayer === 'player1') {
          if (state.phase === 'rolling') {
            const rollBtn = board.querySelector(
              '.pg-roll-btn'
            ) as HTMLButtonElement | null;
            expect(rollBtn).not.toBeNull();
            rollBtn!.click();
          } else if (state.phase === 'placing') {
            const expr = board.querySelector(
              '.pg-expr-item'
            ) as HTMLElement | null;
            const pass = board.querySelector(
              '.pg-btn-secondary'
            ) as HTMLButtonElement | null;
            if (expr) expr.click();
            else if (pass) pass.click();
            else {
              throw new Error('placing phase without expression or pass control');
            }
          }
        }

        await vi.advanceTimersByTimeAsync(1500);
      }

      await vi.advanceTimersByTimeAsync(5000);

      const end = getGameState();
      expect(end?.phase).toBe('gameOver');
      expect(controller.state.phase).toBe('gameOver');
      expect(
        board.querySelector('canvas[data-mp3d="prime-gold"]')
      ).not.toBeNull();
    }
  );
});
