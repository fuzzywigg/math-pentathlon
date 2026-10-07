/**
 * Dev bench: Hard computer-move wall time over seeded positions.
 * Soft tablet budget ≈ 2500ms. Games with AI_PLAY_DEADLINE / workers report
 * capped search; uncapped engines are the sweep targets.
 *
 * Run: npx vitest run tests/unit/tablet-ai-hard-latency.bench.test.ts
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createCallaState } from '../../src/games/calla/types';
import {
  makeMove as makeCallaMove,
  getValidPits,
} from '../../src/games/calla/rules';
import { getAIMove as getCallaAIMove } from '../../src/games/calla/ai';
import { createInitialState as createHexState } from '../../src/games/hex/types';
import {
  makeMove as makeHexMove,
  getValidMoves as getHexValidMoves,
} from '../../src/games/hex/rules';
import {
  searchBestMove as searchHexMove,
  AI_PLAY_DEADLINE_MS as HEX_PLAY_MS,
} from '../../src/games/hex/ai';
import { createInitialState as createQueensState } from '../../src/games/queens-guards/types';
import {
  searchAIMove as searchQueensMove,
  AI_PLAY_DEADLINE_MS as QUEENS_PLAY_MS,
} from '../../src/games/queens-guards/ai';
import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import { placeChip as placeFiarChip } from '../../src/games/fiar/rules';
import { searchAIMove as searchFiarMove } from '../../src/games/fiar/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { getAIMove as getKingsAIMove } from '../../src/games/kings-quadraphages/ai';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import { getAIMove as getPentAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState as createKwatroState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as getKwatroAIMove } from '../../src/games/kwatro-sinko/ai';
import { createInitialState as createStarsState } from '../../src/games/stars-bars/rules';
import { getAIMove as getStarsAIMove } from '../../src/games/stars-bars/ai';
import { createInitialState as createFabState } from '../../src/games/fab-a-diffy/rules';
import {
  searchAIMove as searchFabMove,
  AI_PLAY_DEADLINE_MS as FAB_PLAY_MS,
} from '../../src/games/fab-a-diffy/ai';

const TABLET_BUDGET_MS = 2500;
const SEEDS = [1, 2, 3] as const;

type BenchRow = {
  game: string;
  scenario: string;
  seed: number;
  ms: number;
  capped: boolean;
};

const rows: BenchRow[] = [];

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const original = Math.random;
  let s = seed >>> 0 || 1;
  Math.random = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

function timeMs(fn: () => void): number {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
}

function record(
  game: string,
  scenario: string,
  seed: number,
  ms: number,
  capped: boolean
): void {
  rows.push({ game, scenario, seed, ms, capped });
  // eslint-disable-next-line no-console
  console.log(
    `[bench] ${game.padEnd(14)} ${scenario.padEnd(22)} seed=${seed} ${ms.toFixed(1)}ms${capped ? ' (capped)' : ''}`
  );
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Tablet Hard AI latency bench', () => {
  it('Calla Hard opening + midgame (uncapped minimax depth 6)', () => {
    for (const seed of SEEDS) {
      const opening = createCallaState();
      const msOpen = withSeededRandom(seed, () =>
        timeMs(() => {
          const move = getCallaAIMove(opening, 'player1', 'hard');
          expect(move).not.toBeNull();
        })
      );
      record('calla', 'opening', seed, msOpen, false);

      let mid = opening;
      for (let i = 0; i < 6; i++) {
        const pits = getValidPits(mid);
        if (pits.length === 0) break;
        mid = makeCallaMove(mid, pits[0]);
      }
      const msMid = withSeededRandom(seed + 10, () =>
        timeMs(() => {
          const move = getCallaAIMove(mid, mid.currentPlayer, 'hard');
          expect(move === null || typeof move.pit === 'number').toBe(true);
        })
      );
      record('calla', 'midgame', seed, msMid, false);
    }
  }, 120_000);

  it('Hex Hard midgame (play-budget anytime)', () => {
    for (const seed of SEEDS) {
      let state = createHexState(11);
      state = makeHexMove(state, { row: 5, col: 5 });
      state = makeHexMove(state, { row: 5, col: 6 });
      state = makeHexMove(state, { row: 4, col: 5 });
      state = makeHexMove(state, { row: 6, col: 5 });
      const budget = HEX_PLAY_MS.hard;
      const ms = timeMs(() => {
        const result = searchHexMove(state, 'player1', 'hard', {
          seed,
          deadlineMs: budget,
        });
        expect(result.move).not.toBeNull();
        expect(
          getHexValidMoves(state).some(
            (m) => m.row === result.move!.row && m.col === result.move!.col
          )
        ).toBe(true);
      });
      record('hex', 'midgame-capped', seed, ms, true);
    }
  }, 60_000);

  it('Queens Hard opening (play-budget anytime)', () => {
    for (const seed of SEEDS) {
      const state = createQueensState();
      const budget = QUEENS_PLAY_MS.hard;
      const ms = timeMs(() => {
        const result = searchQueensMove(state, 'player1', 'hard', {
          seed,
          deadlineMs: budget,
        });
        expect(result.move).not.toBeNull();
      });
      record('queens-guards', 'opening-capped', seed, ms, true);
    }
  }, 60_000);

  it('Fab-a-Diffy Hard opening (play-budget anytime)', () => {
    for (const seed of SEEDS) {
      const state = createFabState();
      const budget = FAB_PLAY_MS.hard;
      const ms = timeMs(() => {
        const result = searchFabMove(state, 'player1', 'hard', {
          seed,
          deadlineMs: budget,
        });
        expect(result.move).not.toBeNull();
      });
      record('fab-a-diffy', 'opening-capped', seed, ms, true);
    }
  }, 60_000);

  it('Fab-a-Diffy Hard opening unlimited (baseline)', () => {
    for (const seed of SEEDS) {
      const state = createFabState();
      const ms = timeMs(() => {
        const result = searchFabMove(state, 'player1', 'hard', { seed });
        expect(result.move).not.toBeNull();
        expect(result.truncated).toBe(false);
      });
      record('fab-a-diffy', 'opening-unlimited', seed, ms, false);
    }
  }, 60_000);

  it('FIAR Hard early placement (worker-capable; uncapped sync here)', () => {
    for (const seed of SEEDS) {
      let state = createFiarState();
      state = placeFiarChip(state, 'c3r3', 'plain');
      const ms = timeMs(() => {
        const result = searchFiarMove(state, state.currentPlayer, 'hard', {
          seed,
        });
        expect(result.move === null || result.move !== undefined).toBe(true);
      });
      record('fiar', 'early', seed, ms, false);
    }
  }, 60_000);

  it('Kings Hard opening', () => {
    for (const seed of SEEDS) {
      const state = createInitialGameState();
      const ms = withSeededRandom(seed, () =>
        timeMs(() => {
          const move = getKingsAIMove(state, 'player2', 'hard');
          expect(move === null || move.kingMove !== undefined).toBe(true);
        })
      );
      record('kings', 'opening', seed, ms, false);
    }
  }, 60_000);

  it('Pent-Em-In Hard opening', () => {
    for (const seed of SEEDS) {
      const state = createPentState();
      const ms = withSeededRandom(seed, () =>
        timeMs(() => {
          const move = getPentAIMove(state, 'player1', 'hard');
          expect(move === null || move !== undefined).toBe(true);
        })
      );
      record('pent-em-in', 'opening', seed, ms, false);
    }
  }, 60_000);

  it('Kwatro Hard opening', () => {
    for (const seed of SEEDS) {
      const state = createKwatroState();
      const ms = withSeededRandom(seed, () =>
        timeMs(() => {
          const move = getKwatroAIMove(state, 'player1', 'hard');
          expect(move === null || move !== undefined).toBe(true);
        })
      );
      record('kwatro-sinko', 'opening', seed, ms, false);
    }
  }, 60_000);

  it('Stars & Bars Hard opening', () => {
    for (const seed of SEEDS) {
      const state = createStarsState();
      const ms = withSeededRandom(seed, () =>
        timeMs(() => {
          const move = getStarsAIMove(state, 'player1', 'hard');
          expect(move === null || move !== undefined).toBe(true);
        })
      );
      record('stars-bars', 'opening', seed, ms, false);
    }
  }, 60_000);

  it('summarizes max Hard latency vs tablet budget', () => {
    const byGame = new Map<
      string,
      { cappedMax: number; uncappedMax: number }
    >();
    for (const row of rows) {
      const prev = byGame.get(row.game) ?? { cappedMax: 0, uncappedMax: 0 };
      if (row.capped) {
        prev.cappedMax = Math.max(prev.cappedMax, row.ms);
      } else {
        prev.uncappedMax = Math.max(prev.uncappedMax, row.ms);
      }
      byGame.set(row.game, prev);
    }
    const summary = [...byGame.entries()]
      .map(([game, v]) => {
        const maxMs = Math.max(v.cappedMax, v.uncappedMax);
        const overBudget =
          (v.cappedMax > 0 && v.cappedMax > TABLET_BUDGET_MS + 750) ||
          (v.uncappedMax > TABLET_BUDGET_MS && v.cappedMax === 0);
        return {
          game,
          maxMs,
          cappedMax: v.cappedMax,
          uncappedMax: v.uncappedMax,
          overBudget,
        };
      })
      .sort((a, b) => b.maxMs - a.maxMs);

    // eslint-disable-next-line no-console
    console.log('\n=== Hard AI max latency (ms) ===');
    for (const s of summary) {
      // eslint-disable-next-line no-console
      console.log(
        `${s.game.padEnd(16)} max=${s.maxMs.toFixed(1)} capped=${s.cappedMax.toFixed(1)} uncapped=${s.uncappedMax.toFixed(1)}${s.overBudget ? '  << OVER 2.5s' : ''}`
      );
    }

    expect(summary.length).toBeGreaterThan(0);
    // Games with a play-budget must stay near it; uncapped-only games must be under 2.5s.
    expect(summary.every((s) => !s.overBudget)).toBe(true);
  });
});
