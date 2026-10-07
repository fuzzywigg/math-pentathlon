/**
 * Playtest regression: seeded vs-AI Prime Gold games must reach gameOver.
 * Guards the mid-game "Roll the dice" soft-lock caused by negative chip counts
 * skipping the chip-exhaustion settle (board-full pass loops).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AIDifficulty } from '../../src/games/prime-gold/ai';

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('Prime Gold seeded multi-game AI end', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    try {
      const { destroyGame } = await import(
        '../../src/games/prime-gold/game-controller'
      );
      destroyGame();
    } catch {
      // ignore
    }
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    vi.restoreAllMocks();
  });

  it.each([
    ['easy', 12],
    ['medium', 12],
    ['hard', 8],
  ] as const)(
    'reaches gameOver for %s across %i seeds (no Roll stall)',
    async (difficulty: AIDifficulty, seedCount: number) => {
      const { initGame, getGameState, destroyGame } = await import(
        '../../src/games/prime-gold/game-controller'
      );

      const failures: Array<{
        seed: number;
        phase: string;
        player: string;
        status: string;
        chips: [number, number];
        empty: number;
        moves: number;
      }> = [];

      for (let seed = 0; seed < seedCount; seed++) {
        destroyGame();
        document.body.innerHTML = '';
        vi.spyOn(Math, 'random').mockImplementation(
          mulberry32(seed * 9973 + difficulty.length * 131)
        );

        const board = document.createElement('div');
        document.body.append(board);
        initGame(board, true, difficulty);

        for (let step = 0; step < 250; step++) {
          const state = getGameState();
          if (!state || state.phase === 'gameOver') break;

          if (state.currentPlayer === 'player1') {
            if (state.phase === 'rolling') {
              const rollBtn = board.querySelector(
                '.pg-roll-btn'
              ) as HTMLButtonElement | null;
              if (!rollBtn) {
                failures.push({
                  seed,
                  phase: state.phase,
                  player: state.currentPlayer,
                  status:
                    board.querySelector('.pg-status')?.textContent ??
                    '(no roll)',
                  chips: [
                    state.playerChips.player1,
                    state.playerChips.player2,
                  ],
                  empty: [...state.cells.values()].filter((c) => !c.owner)
                    .length,
                  moves: state.moveHistory.length,
                });
                break;
              }
              rollBtn.click();
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
                failures.push({
                  seed,
                  phase: state.phase,
                  player: state.currentPlayer,
                  status:
                    board.querySelector('.pg-status')?.textContent ??
                    '(no place)',
                  chips: [
                    state.playerChips.player1,
                    state.playerChips.player2,
                  ],
                  empty: [...state.cells.values()].filter((c) => !c.owner)
                    .length,
                  moves: state.moveHistory.length,
                });
                break;
              }
            }
          }

          await vi.advanceTimersByTimeAsync(1500);
        }

        const end = getGameState();
        if (end?.phase !== 'gameOver') {
          failures.push({
            seed,
            phase: end?.phase ?? '?',
            player: end?.currentPlayer ?? '?',
            status:
              board.querySelector('.pg-status')?.textContent ?? '(timeout)',
            chips: [
              end?.playerChips.player1 ?? -1,
              end?.playerChips.player2 ?? -1,
            ],
            empty: end
              ? [...end.cells.values()].filter((c) => !c.owner).length
              : -1,
            moves: end?.moveHistory.length ?? 0,
          });
        }

        // Chip supply must never go negative after the playability fix.
        if (end) {
          expect(end.playerChips.player1).toBeGreaterThanOrEqual(0);
          expect(end.playerChips.player2).toBeGreaterThanOrEqual(0);
        }
      }

      expect(failures).toEqual([]);
    },
    120_000
  );
});
