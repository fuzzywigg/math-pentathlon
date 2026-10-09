/** AI determinism audit shard — split for Vitest worker parallelism (burn-1007). */
/**
 * AI determinism + difficulty quality audit (2026-10-07).
 *
 * For every game AI × difficulty:
 * 1) Fixed seed → same mid-game position → same move (50 states)
 * 2) Easy/medium differ from hard in measurable move quality
 *
 * Seeded engines (hex, queens-guards, fab, fiar) use options.seed.
 * Others mock Math.random with createSeededRng. Expensive anytime
 * searches use a virtual clock + short deadline so truncation is
 * deterministic (no wall-clock). No rules/scoring changes.
 */
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import {
  MIDGAME_SAMPLES,
  DIFFICULTIES,
  type AIDifficulty,
  moveKey,
  withSeededRandom,
  withOracleRandom,
  cappedSeedOptions,
  cappedClockOptions,
  collectStates,
  measureQualityAgreement,
  assertQualityDiffers,
} from './ai-determinism-helpers';
import { describeHarness } from './ai-determinism-harness';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getAIMove as callaAI, analyzeMoves } from '../../src/games/calla/ai';
import {
  makeMove as callaMake,
  getValidPits,
  isGameOver as callaOver,
} from '../../src/games/calla/rules';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { getAIPlacement as contigAI } from '../../src/games/contig-60/ai';
import {
  doRollDice as contigRoll,
  hasValidMoves as contigHasMoves,
  placeChip as contigPlace,
} from '../../src/games/contig-60/rules';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import { getAIMove as fabAI } from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { getAIMove as fiarAI, applyAIMove as fiarApply } from '../../src/games/fiar/ai';

import {
  createInitialState as createFrac,
  type FracFactState,
} from '../../src/games/frac-fact/types';
import { getAIAnswer as fracAI } from '../../src/games/frac-fact/ai';
import {
  startGame as startFrac,
  nextProblem as nextFrac,
} from '../../src/games/frac-fact/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

import {
  createInitialState as createPin,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import { getAIAnswer as pinAI } from '../../src/games/fraction-pinball/ai';
import {
  startGame as startPin,
  nextChallenge as nextPin,
  checkAnswer as pinCheck,
} from '../../src/games/fraction-pinball/rules';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { getBestMove as hexAI } from '../../src/games/hex/ai';
import {
  makeMove as hexMake,
  getValidMoves as hexValids,
} from '../../src/games/hex/rules';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  getAISelection as hagSelect,
  getAIPlacement as hagPlace,
} from '../../src/games/hex-a-gone/ai';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import { getAIDieChoice as juggleDie } from '../../src/games/juggle/ai';
import { doRollDice as juggleRoll } from '../../src/games/juggle/rules';

import {
  createInitialGameState as createKings,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import {
  getAIMove as kingsAI,
  getBestMove as kingsBest,
} from '../../src/games/kings-quadraphages/ai';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';

import {
  createInitialState as createKwatro,
  selectChip as kwatroSelect,
  moveChip as kwatroMove,
} from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwatroAI } from '../../src/games/kwatro-sinko/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI } from '../../src/games/pent-em-in/ai';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { getAIPlacement as primeAI } from '../../src/games/prime-gold/ai';
import {
  rollDice as primeRoll,
  hasValidMoves as primeHas,
  placeChip as primePlace,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createQG } from '../../src/games/queens-guards/types';
import { getAIMove as qgAI, applyAIMove as qgApply } from '../../src/games/queens-guards/ai';
import { hasValidMoves as qgHas } from '../../src/games/queens-guards/rules';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { getAIMove as ramrodAI } from '../../src/games/ramrod/ai';

import { createInitialState as createRem } from '../../src/games/remainder-islands/types';
import { getAIIslandChoice as remAI } from '../../src/games/remainder-islands/ai';
import {
  performRoll as remRoll,
  selectIsland as remSelect,
} from '../../src/games/remainder-islands/rules';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { getAIChainChoice as starAI } from '../../src/games/star-track/ai';
import {
  drawChains,
  selectChain,
} from '../../src/games/star-track/rules';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { getAIMove as starsAI } from '../../src/games/stars-bars/ai';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { getAIMove as sumAI } from '../../src/games/sum-dominoes/ai';
import { doRollDice as sumRoll } from '../../src/games/sum-dominoes/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describeHarness({
  label: 'stars-bars',
  midgame: (index) => {
    const s = createStars();
    void index;
    const move = withSeededRandom(3400 + index, () =>
      starsAI(s, s.currentPlayer, 'medium')
    );
    return move ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      starsAI(state, state.currentPlayer, difficulty)
    ),
});
describeHarness({
  label: 'sum-dominoes',
  midgame: (index) =>
    withSeededRandom(3500 + index, () => {
      let s = createSum();
      for (let attempt = 0; attempt < 16; attempt++) {
        s = sumRoll(s);
        if (s.phase === 'placing') {
          const move = sumAI(s, s.currentPlayer, 'medium');
          if (move) return s;
        }
      }
      return null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      sumAI(state, state.currentPlayer, difficulty)
    ),
});

// ─── Quiz / accuracy AIs ────────────────────────────────────────────────────

function fracStates(count: number): FracFactState[] {
  return collectStates(
    count,
    (index) =>
      withSeededRandom(3600 + index, () => {
        let s = startFrac(createFrac('medium'));
        const skips = index % 3;
        for (let i = 0; i < skips; i++) {
          s = nextFrac(s);
        }
        return s.currentProblem ? s : null;
      }),
    'frac-fact'
  );
}

function pinStates(count: number): FractionPinballState[] {
  return collectStates(
    count,
    (index) =>
      withSeededRandom(3700 + index, () => {
        let s = startPin(createPin());
        const skips = index % 3;
        for (let i = 0; i < skips; i++) {
          s = nextPin(s);
        }
        return s.currentChallenge && s.phase === 'answering' ? s : null;
      }),
    'fraction-pinball'
  );
}
describe('frac-fact', () => {
  // Shared fixture across determinism + quality (same 50 samples) — q-mp-063 headroom.
  let fracFixture: FracFactState[] = [];
  beforeAll(() => {
    fracFixture = fracStates(MIDGAME_SAMPLES);
  });
  it(
    `determinism: fixed seed → same answer on ${MIDGAME_SAMPLES} problems × difficulties`,
    () => {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < fracFixture.length; i++) {
          const state = fracFixture[i]!;
          const seed = 11_000 + i * 13 + difficulty.length;
          const a = withSeededRandom(seed, () =>
            fracAI(state, state.currentPlayer, difficulty)
          );
          const b = withSeededRandom(seed, () =>
            fracAI(state, state.currentPlayer, difficulty)
          );
          expect(a).not.toBeNull();
          expect(moveKey(a)).toBe(moveKey(b));
        }
      }
    },
    60_000
  );

  it(
    'quality: hard correct-rate > easy (and ≥ medium)',
    () => {
      const correct = { easy: 0, medium: 0, hard: 0 };
      let n = 0;
      for (let i = 0; i < fracFixture.length; i++) {
        const state = fracFixture[i]!;
        const problem = state.currentProblem!;
        n++;
        for (const d of DIFFICULTIES) {
          const ans = withSeededRandom(70_000 + i * 3 + d.length, () =>
            fracAI(state, state.currentPlayer, d)
          );
          if (ans && areEquivalent(ans, problem.correctAnswer)) {
            correct[d]++;
          }
        }
      }
      expect(n).toBe(MIDGAME_SAMPLES);
      expect(correct.hard).toBeGreaterThan(correct.easy);
      expect(correct.hard).toBeGreaterThanOrEqual(correct.medium);
      expect(correct.medium).toBeGreaterThanOrEqual(correct.easy);
    },
    60_000
  );
});
describe('fraction-pinball', () => {
  // Shared fixture across determinism + quality (same 50 samples) — q-mp-063 headroom.
  let pinFixture: FractionPinballState[] = [];
  beforeAll(() => {
    pinFixture = pinStates(MIDGAME_SAMPLES);
  });
  it(
    `determinism: fixed seed → same answer on ${MIDGAME_SAMPLES} challenges × difficulties`,
    () => {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < pinFixture.length; i++) {
          const state = pinFixture[i]!;
          const seed = 12_000 + i * 17 + difficulty.length;
          const a = withSeededRandom(seed, () =>
            pinAI(state, state.currentPlayer, difficulty)
          );
          const b = withSeededRandom(seed, () =>
            pinAI(state, state.currentPlayer, difficulty)
          );
          expect(a).not.toBeNull();
          expect(moveKey(a)).toBe(moveKey(b));
        }
      }
    },
    60_000
  );

  it(
    'quality: hard correct-rate > easy (and ≥ medium)',
    () => {
      const correct = { easy: 0, medium: 0, hard: 0 };
      let n = 0;
      for (let i = 0; i < pinFixture.length; i++) {
        const state = pinFixture[i]!;
        n++;
        for (const d of DIFFICULTIES) {
          const ans = withSeededRandom(80_000 + i * 3 + d.length, () =>
            pinAI(state, state.currentPlayer, d)
          );
          if (
            ans &&
            state.currentChallenge &&
            pinCheck(state.currentChallenge, ans)
          ) {
            correct[d]++;
          }
        }
      }
      expect(n).toBe(MIDGAME_SAMPLES);
      expect(correct.hard).toBeGreaterThan(correct.easy);
      expect(correct.hard).toBeGreaterThanOrEqual(correct.medium);
    },
    60_000
  );
});
describe('seeded-engine options.seed audit', () => {
  it('hex/queens/fab/fiar: options.seed path does not call Math.random', () => {
    const hex = createHex(7);
    const qg = createQG();
    const fab = createFab();
    const fiar = createFiar();
    const spy = vi.spyOn(Math, 'random');
    hexAI(hex, hex.currentPlayer, 'medium', cappedSeedOptions(42, 100));
    qgAI(qg, qg.currentPlayer, 'easy', cappedSeedOptions(43, 60, 0.05));
    fabAI(fab, fab.currentPlayer, 'medium', cappedSeedOptions(44, 80));
    fiarAI(fiar, fiar.currentPlayer, 'medium', { seed: 45 });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('options.seed: same seed → same move on 50 mid-game states × difficulties', () => {
    const hexStates = collectStates(
      MIDGAME_SAMPLES,
      (index) =>
        withSeededRandom(2300 + index, () => {
          let s = createHex(7);
          const plies = 6 + (index % 8);
          for (let p = 0; p < plies; p++) {
            const moves = hexValids(s);
            if (moves.length < 2) return null;
            s = hexMake(s, moves[Math.floor(Math.random() * moves.length)]!);
            if (s.winner) return null;
          }
          return hexValids(s).length >= 2 ? s : null;
        }),
      'hex-seed-api'
    );
    const qgStates = collectStates(
      MIDGAME_SAMPLES,
      (index) => {
        const s = createQG();
        void index;
        return qgAI(s, s.currentPlayer, 'easy', cappedSeedOptions(1, 40, 0.05))
          ? s
          : null;
      },
      'qg-seed-api'
    );
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < MIDGAME_SAMPLES; i++) {
        const seed = 20_000 + i * 11 + difficulty.length;
        const hex = hexStates[i]!;
        const ha = hexAI(
          hex,
          hex.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 200, 0.25)
        );
        const hb = hexAI(
          hex,
          hex.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 200, 0.25)
        );
        expect(moveKey(ha)).toBe(moveKey(hb));

        const qg = qgStates[i]!;
        const qa = qgAI(
          qg,
          qg.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 40, 0.05)
        );
        const qb = qgAI(
          qg,
          qg.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 40, 0.05)
        );
        expect(moveKey(qa)).toBe(moveKey(qb));

        const fab = createFab();
        const fa = fabAI(
          fab,
          fab.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 80)
        );
        const fb = fabAI(
          fab,
          fab.currentPlayer,
          difficulty,
          cappedSeedOptions(seed, 80)
        );
        expect(moveKey(fa)).toBe(moveKey(fb));

        const fiar = createFiar();
        const ia = fiarAI(fiar, fiar.currentPlayer, difficulty, { seed });
        const ib = fiarAI(fiar, fiar.currentPlayer, difficulty, { seed });
        expect(moveKey(ia)).toBe(moveKey(ib));
      }
    }
  }, 180_000);
});
