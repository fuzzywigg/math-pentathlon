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
