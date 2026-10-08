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
