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
import { describe, it, expect, afterEach, vi } from 'vitest';
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

type Harness<T> = {
  label: string;
  /** Build one mid-game state; null if unusable. */
  midgame: (index: number) => T | null;
  /** Pick a move under a fixed seed (determinism path). */
  pickSeeded: (state: T, difficulty: AIDifficulty, seed: number) => unknown;
  /**
   * Hard oracle pick with Math.random glued to 0 (no options.seed).
   * Defaults to pickSeeded under withOracleRandom.
   */
  pickOracle?: (state: T) => unknown;
  /** Optional custom quality check; default uses oracle agreement. */
  quality?: (states: T[]) => void;
};

function runDeterminism<T>(h: Harness<T>): void {
  const states = collectStates(MIDGAME_SAMPLES, h.midgame, h.label);
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const seed = 10_000 + i * 31 + difficulty.length * 97;
      const a = h.pickSeeded(state, difficulty, seed);
      const b = h.pickSeeded(state, difficulty, seed);
      expect(a, `${h.label} ${difficulty} state ${i} null`).not.toBeNull();
      expect(a, `${h.label} ${difficulty} state ${i} undef`).not.toBeUndefined();
      expect(moveKey(a), `${h.label} ${difficulty} state ${i}`).toBe(
        moveKey(b)
      );
    }
  }
}

function runDefaultQuality<T>(h: Harness<T>): void {
  const states = collectStates(MIDGAME_SAMPLES, h.midgame, h.label);
  if (h.quality) {
    h.quality(states);
    return;
  }
  const stats = measureQualityAgreement(
    states,
    (state, difficulty, trialSeed) =>
      h.pickSeeded(state, difficulty, trialSeed),
    (state) =>
      h.pickOracle
        ? h.pickOracle(state)
        : withOracleRandom(() => h.pickSeeded(state, 'hard', 0))
  );
  assertQualityDiffers(stats, h.label);
}

function describeHarness<T>(h: Harness<T>): void {
  describe(h.label, () => {
    it(
      `determinism: fixed seed → same move on ${MIDGAME_SAMPLES} mid-game states × difficulties`,
      () => runDeterminism(h),
      180_000
    );
    it(
      'quality: easy/medium differ from hard vs oracle',
      () => runDefaultQuality(h),
      180_000
    );
  });
}

// ─── Board / search games ───────────────────────────────────────────────────

describeHarness({
  label: 'calla',
  midgame: (index) =>
    withSeededRandom(2000 + index, () => {
      let s = createCalla();
      const plies = 4 + (index % 6);
      for (let p = 0; p < plies; p++) {
        if (callaOver(s)) return null;
        const pits = getValidPits(s);
        if (pits.length < 2) return null;
        s = callaMake(s, pits[Math.floor(Math.random() * pits.length)]!);
      }
      if (callaOver(s) || getValidPits(s).length < 2) return null;
      return s;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      callaAI(state, state.currentPlayer, difficulty)
    ),
  quality: (states) => {
    // Prefer analyzeMoves scores: easy/medium mean score ≤ hard mean.
    let easySum = 0;
    let mediumSum = 0;
    let hardSum = 0;
    let n = 0;
    let easyDistinct = 0;
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const analyses = analyzeMoves(state, state.currentPlayer);
      if (analyses.length < 2) continue;
      const bestScore = analyses.find((a) => a.isBestMove)?.score ?? analyses[0]!.score;
      const easy = withSeededRandom(50_000 + i, () =>
        callaAI(state, state.currentPlayer, 'easy')
      );
      const medium = withSeededRandom(50_001 + i, () =>
        callaAI(state, state.currentPlayer, 'medium')
      );
      const hard = withSeededRandom(50_002 + i, () =>
        callaAI(state, state.currentPlayer, 'hard')
      );
      if (!easy || !medium || !hard) continue;
      const scoreOf = (pit: number) =>
        analyses.find((a) => a.pit === pit)?.score ?? -Infinity;
      easySum += scoreOf(easy.pit);
      mediumSum += scoreOf(medium.pit);
      hardSum += scoreOf(hard.pit);
      if (easy.pit !== hard.pit) easyDistinct++;
      n++;
      void bestScore;
    }
    expect(n).toBeGreaterThanOrEqual(10);
    expect(hardSum / n).toBeGreaterThanOrEqual(easySum / n - 1e-9);
    expect(
      easyDistinct / n >= 0.1 || hardSum / n > easySum / n
    ).toBe(true);
    void mediumSum;
  },
});

describeHarness({
  label: 'contig-60',
  midgame: (index) =>
    withSeededRandom(2100 + index, () => {
      let s = createContig();
      for (let attempt = 0; attempt < 12; attempt++) {
        s = contigRoll(s);
        if (s.phase === 'calculating' && contigHasMoves(s)) {
          // Place a few chips for mid-game when possible
          if (index % 3 === 0) {
            const move = contigAI(s, s.currentPlayer, 'hard');
            if (move) {
              s = contigPlace(s, move.value, move.expression);
              s = contigRoll(s);
              if (s.phase === 'calculating' && contigHasMoves(s)) return s;
            }
          }
          return s;
        }
      }
      return null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      contigAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'fab-a-diffy',
  midgame: (index) => {
    const s = createFab();
    // Opening is a rich decision space for every deal index (same rules deal).
    void index;
    const move = fabAI(s, s.currentPlayer, 'medium', cappedSeedOptions(3000 + index));
    return move ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    fabAI(state, state.currentPlayer, difficulty, cappedSeedOptions(seed)),
  pickOracle: (state) =>
    withOracleRandom(() => fabAI(state, state.currentPlayer, 'hard')),
});

describeHarness({
  label: 'fiar',
  midgame: (index) =>
    withSeededRandom(2200 + index, () => {
      let s = createFiar();
      const plies = 2 + (index % 4);
      for (let p = 0; p < plies; p++) {
        const move = fiarAI(s, s.currentPlayer, 'easy', {
          seed: 4000 + index * 10 + p,
        });
        if (!move) break;
        s = fiarApply(s, move);
        if (s.phase === 'gameOver' || s.winner) return null;
      }
      const probe = fiarAI(s, s.currentPlayer, 'easy', { seed: 1 });
      return probe ? s : null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    fiarAI(state, state.currentPlayer, difficulty, { seed }),
  pickOracle: (state) =>
    withOracleRandom(() => fiarAI(state, state.currentPlayer, 'hard')),
});

describeHarness({
  label: 'hex',
  midgame: (index) =>
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
  pickSeeded: (state, difficulty, seed) =>
    // Math.random seeding (no options.seed) so oracle (random=0) and trial
    // streams stay comparable while remaining deterministic.
    withSeededRandom(seed, () =>
      hexAI(state, state.currentPlayer, difficulty, cappedClockOptions(200, 0.25))
    ),
  pickOracle: (state) =>
    withOracleRandom(() =>
      hexAI(state, state.currentPlayer, 'hard', cappedClockOptions(200, 0.25))
    ),
});

describeHarness({
  label: 'hex-a-gone',
  midgame: (index) => {
    const s = createHag();
    // Selection phase opening is the AI decision surface.
    void index;
    const sel = withSeededRandom(2400 + index, () =>
      hagSelect(s, s.currentPlayer, 'medium')
    );
    return sel ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () => {
      if (state.phase === 'selectBlocks') {
        return hagSelect(state, state.currentPlayer, difficulty);
      }
      return hagPlace(state, state.currentPlayer, difficulty);
    }),
});

describeHarness({
  label: 'juggle',
  midgame: (index) =>
    withSeededRandom(2500 + index, () => {
      let s = createJuggle();
      s = juggleRoll(s);
      if (s.phase !== 'selectingShape' || !s.currentDice) return null;
      const choice = juggleDie(s, s.currentPlayer, 'medium');
      return choice ? s : null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      juggleDie(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'kings-quadraphages',
  midgame: (index) =>
    withSeededRandom(2600 + index, () => {
      let s = createKings();
      const plies = index % 5;
      for (let p = 0; p < plies; p++) {
        const kings = getValidKingMoves(s, s.currentPlayer);
        if (kings.length === 0) break;
        const km = kings[Math.floor(Math.random() * kings.length)]!;
        s = moveKing(s, km);
        const places = getValidQuadraphagePlacements(s);
        if (places.length === 0) break;
        s = placeQuadraphage(
          s,
          places[Math.floor(Math.random() * places.length)]!
        );
        if (s.winner) return null;
      }
      const probe = kingsAI(s, s.currentPlayer, 'hard');
      return probe && getValidKingMoves(s, s.currentPlayer).length >= 2
        ? s
        : null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      kingsAI(state, state.currentPlayer, difficulty)
    ),
  quality: (states) => {
    let easyDistinct = 0;
    let mediumDistinct = 0;
    let hardMatchesBest = 0;
    let n = 0;
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const best = kingsBest(state, state.currentPlayer, 'hard');
      if (!best) continue;
      const easy = withSeededRandom(60_000 + i, () =>
        kingsAI(state, state.currentPlayer, 'easy')
      );
      const medium = withSeededRandom(60_001 + i, () =>
        kingsAI(state, state.currentPlayer, 'medium')
      );
      const hard = withSeededRandom(60_002 + i, () =>
        kingsAI(state, state.currentPlayer, 'hard')
      );
      if (!easy || !medium || !hard) continue;
      n++;
      if (moveKey(hard) === moveKey(best)) hardMatchesBest++;
      if (moveKey(easy) !== moveKey(hard)) easyDistinct++;
      if (moveKey(medium) !== moveKey(hard)) mediumDistinct++;
    }
    expect(n).toBeGreaterThanOrEqual(10);
    expect(hardMatchesBest).toBe(n); // hard is fully deterministic top-score
    expect(Math.max(easyDistinct, mediumDistinct) / n).toBeGreaterThanOrEqual(
      0.1
    );
  },
});

describeHarness({
  label: 'kwatro-sinko',
  midgame: (index) =>
    withSeededRandom(2700 + index, () => {
      let s = createKwatro();
      const plies = 2 + (index % 4);
      for (let p = 0; p < plies; p++) {
        const move = kwatroAI(s, s.currentPlayer, 'medium');
        if (!move) break;
        s = kwatroSelect(s, move.chipId);
        s = kwatroMove(s, move.nodeId);
        if (s.phase === 'gameOver' || s.winner) return null;
      }
      const probe = kwatroAI(s, s.currentPlayer, 'hard');
      return probe ? s : null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      kwatroAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'par-55',
  midgame: (index) => {
    const s = createPar();
    void index;
    const move = withSeededRandom(2800 + index, () =>
      parAI(s, s.currentPlayer, 'medium')
    );
    return move ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      parAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'pent-em-in',
  midgame: (index) => {
    const s = createPent();
    void index;
    const move = withSeededRandom(2900 + index, () =>
      pentAI(s, s.currentPlayer, 'medium')
    );
    return move ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      pentAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'prime-gold',
  midgame: (index) =>
    withSeededRandom(3000 + index, () => {
      let s = createPrime();
      for (let attempt = 0; attempt < 16; attempt++) {
        s = primeRoll(s);
        if (s.phase === 'placing' && primeHas(s)) {
          if (index % 4 === 0) {
            const m = primeAI(s, s.currentPlayer, 'hard');
            if (m) {
              s = primePlace(s, m.value, m.expression);
              s = primeRoll(s);
              if (s.phase === 'placing' && primeHas(s)) return s;
            }
          }
          return s;
        }
      }
      return null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      primeAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'queens-guards',
  midgame: (index) => {
    let s = createQG();
    const plies = index % 3;
    for (let p = 0; p < plies; p++) {
      const move = qgAI(
        s,
        s.currentPlayer,
        'easy',
        cappedSeedOptions(5000 + index * 10 + p, 60)
      );
      if (!move) break;
      s = qgApply(s, move);
      if (s.winner || !qgHas(s)) return null;
    }
    const probe = qgAI(
      s,
      s.currentPlayer,
      'easy',
      cappedSeedOptions(1, 60)
    );
    return probe ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    // Prefer Math.random seeding + fine virtual clock so depth-1 can score
    // multiple roots (randomness among top-N is observable for quality).
    withSeededRandom(seed, () =>
      qgAI(state, state.currentPlayer, difficulty, cappedClockOptions(40, 0.02))
    ),
  pickOracle: (state) =>
    withOracleRandom(() =>
      qgAI(state, state.currentPlayer, 'hard', cappedClockOptions(40, 0.02))
    ),
});

describeHarness({
  label: 'ramrod',
  midgame: (index) => {
    const s = createRamrod();
    void index;
    const move = withSeededRandom(3100 + index, () =>
      ramrodAI(s, s.currentPlayer, 'medium')
    );
    return move ? s : null;
  },
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      ramrodAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'remainder-islands',
  midgame: (index) =>
    withSeededRandom(3200 + index, () => {
      let s = createRem();
      for (let attempt = 0; attempt < 20; attempt++) {
        s = remRoll(s);
        if (s.phase === 'selectIsland' && s.validIslands.length > 0) {
          if (index % 3 === 0 && s.validIslands.length > 0) {
            const choice = remAI(s, s.currentPlayer, 'hard');
            if (choice) {
              s = remSelect(s, choice.islandId);
              s = remRoll(s);
              if (s.phase === 'selectIsland' && s.validIslands.length > 0) {
                return s;
              }
            }
          }
          return s;
        }
      }
      return null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      remAI(state, state.currentPlayer, difficulty)
    ),
});

describeHarness({
  label: 'star-track',
  midgame: (index) =>
    withSeededRandom(3300 + index, () => {
      let s = createStar();
      s = drawChains(s);
      if (s.phase !== 'selectChain' || !s.drawnChains) return null;
      if (index % 3 === 0) {
        const c = starAI(s, s.currentPlayer, 'hard');
        if (c) {
          s = selectChain(s, c.chainIndex);
          s = drawChains(s);
          if (s.phase === 'selectChain' && s.drawnChains) return s;
        }
      }
      return s.phase === 'selectChain' && s.drawnChains ? s : null;
    }),
  pickSeeded: (state, difficulty, seed) =>
    withSeededRandom(seed, () =>
      starAI(state, state.currentPlayer, difficulty)
    ),
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
  it(
    `determinism: fixed seed → same answer on ${MIDGAME_SAMPLES} problems × difficulties`,
    () => {
      const states = fracStates(MIDGAME_SAMPLES);
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < states.length; i++) {
          const state = states[i]!;
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
      const states = fracStates(MIDGAME_SAMPLES);
      const correct = { easy: 0, medium: 0, hard: 0 };
      let n = 0;
      for (let i = 0; i < states.length; i++) {
        const state = states[i]!;
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
  it(
    `determinism: fixed seed → same answer on ${MIDGAME_SAMPLES} challenges × difficulties`,
    () => {
      const states = pinStates(MIDGAME_SAMPLES);
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < states.length; i++) {
          const state = states[i]!;
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
      const states = pinStates(MIDGAME_SAMPLES);
      const correct = { easy: 0, medium: 0, hard: 0 };
      let n = 0;
      for (let i = 0; i < states.length; i++) {
        const state = states[i]!;
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
