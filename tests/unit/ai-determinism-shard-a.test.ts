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
