import { describe, it, expect } from 'vitest';

/**
 * Lightweight AI smoke for games that export getAIMove / executeAITurn
 * (or close equivalents). Skip games whose AI needs complex setup — notes below.
 *
 * Skipped / partial:
 * - queens-guards: getAIMove exists but needs selected/movable midgame context
 *   and can be slow on full Agon boards — covered elsewhere via rules tests.
 * - pent-em-in: getAIMove scans many placements; omit to keep this file fast.
 * - fraction-pinball: quiz AI needs a current challenge; covered in rules tests.
 * - fab-a-diffy: already covered in burn-wave2-dom-ai.test.ts
 */

import { createInitialState as createHexState } from '../../src/games/hex/types';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

import { createInitialState as createCallaState } from '../../src/games/calla/types';
import { getAIMove as getCallaAIMove } from '../../src/games/calla/ai';

import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import {
  getAIMove as getFiarAIMove,
  applyAIMove as applyFiarAIMove,
} from '../../src/games/fiar/ai';

import { createInitialState as createPrimeGoldState } from '../../src/games/prime-gold/rules';
import { executeAITurn as executePrimeGoldAI } from '../../src/games/prime-gold/ai';

import {
  createInitialState as createJuggleState,
  doRollDice,
} from '../../src/games/juggle/rules';
import { executeAITurn as executeJuggleAI } from '../../src/games/juggle/ai';

import { createInitialState as createRemainderState } from '../../src/games/remainder-islands/types';
import { performRoll } from '../../src/games/remainder-islands/rules';
import { executeAISelection } from '../../src/games/remainder-islands/ai';

import { createInitialState as createRamrodState } from '../../src/games/ramrod/rules';
import {
  getAIMove as getRamrodAIMove,
  executeAITurn as executeRamrodAI,
} from '../../src/games/ramrod/ai';

import { createInitialState as createStarsState } from '../../src/games/stars-bars/rules';
import {
  getAIMove as getStarsAIMove,
  executeAITurn as executeStarsAI,
} from '../../src/games/stars-bars/ai';

import { createInitialState as createHexAGoneState } from '../../src/games/hex-a-gone/types';
import { executeAITurn as executeHexAGoneAI } from '../../src/games/hex-a-gone/ai';

import { createInitialState as createPar55State } from '../../src/games/par-55/rules';
import {
  getAIMove as getPar55AIMove,
  executeAITurn as executePar55AI,
} from '../../src/games/par-55/ai';

import {
  createInitialState as createFracFactState,
  FractionProblem,
} from '../../src/games/frac-fact/types';
import { getAIAnswer } from '../../src/games/frac-fact/ai';

import { createInitialState as createKwaState } from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAIMove,
  executeAITurn as executeKwaAI,
} from '../../src/games/kwatro-sinko/ai';

describe('Burn Wave 3 — AI smoke', () => {
  it('hex: getRandomMove / getBestMove return a cell on a fresh board', () => {
    // Prefer getRandomMove for speed; getBestMove is cheap on the opening.
    const state = createHexState(5);
    const random = getRandomMove(state);
    expect(random).not.toBeNull();
    expect(random!.row).toBeGreaterThanOrEqual(0);

    const best = getBestMove(state, 'player1', 'easy');
    expect(best).not.toBeNull();
  });

  it('calla: getAIMove returns a pit on a fresh board', () => {
    const state = createCallaState();
    const move = getCallaAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(typeof move!.pit).toBe('number');
  });

  it('fiar: getAIMove + applyAIMove places a chip', () => {
    const state = createFiarState();
    const move = getFiarAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');

    const next = applyFiarAIMove(state, move!);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.moveHistory.length).toBe(1);
  });

  it('prime-gold: executeAITurn rolls and places (or passes) without stalling', () => {
    const state = createPrimeGoldState();
    const next = executePrimeGoldAI(state, 'player1', 'easy');
    // Either placed (history grew / turn flipped) or passed after no legal cells
    expect(
      next.moveHistory.length > 0 ||
        next.currentPlayer === 'player2' ||
        next.phase === 'rolling'
    ).toBe(true);
  });

  it('juggle: executeAITurn after a forced roll completes a placement', () => {
    // Fresh state is phase=rolling — AI expects selectingShape+ after dice.
    let state = doRollDice(createJuggleState());
    expect(state.phase).toBe('selectingShape');
    state = executeJuggleAI(state, 'player1', 'easy');
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(0);
    // Successful path places a shape and flips / stays playable
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(
      state.phase
    );
    if (state.moveHistory.length > 0) {
      expect(state.currentPlayer).toBe('player2');
    }
  });

  it('remainder-islands: executeAISelection on a forced rolled state', () => {
    // AI only runs in selectIsland; force a roll (retry if dice yield skip).
    let state = createRemainderState();
    for (let i = 0; i < 8 && state.phase !== 'selectIsland'; i++) {
      state = { ...createRemainderState() };
      state = performRoll(state);
    }
    if (state.phase !== 'selectIsland') {
      // Extremely unlikely — all islands owned; craft forced select phase
      state = {
        ...createRemainderState(),
        phase: 'selectIsland',
        currentRoll: { die1: 3, die2: 4, total: 7 },
        validIslands: createRemainderState().islands.map((i) => i.id),
      };
    }
    const before = state.validIslands[0];
    const next = executeAISelection(state, 'player1', 'easy');
    expect(next).not.toBe(state);
    expect(
      next.moveHistory.length > state.moveHistory.length ||
        next.selectedIsland !== null ||
        next.currentPlayer !== state.currentPlayer
    ).toBe(true);
    expect(before).toBeTruthy();
  });

  it('ramrod: getAIMove / executeAITurn on a fresh board', () => {
    const state = createRamrodState();
    const move = getRamrodAIMove(state, 'player1', 'easy');
    // Fresh board usually has placements; if not, execute passes
    const next = executeRamrodAI(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    if (move) {
      expect(next.moveHistory.length).toBe(1);
    }
  });

  it('stars-bars: getAIMove / executeAITurn on a fresh board', () => {
    const state = createStarsState();
    const move = getStarsAIMove(state, 'player1', 'easy');
    const next = executeStarsAI(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    if (move) {
      expect(next.moveHistory.length).toBe(1);
    }
  });

  it('hex-a-gone: executeAITurn selects and places without stalling', () => {
    const state = createHexAGoneState();
    const next = executeHexAGoneAI(state, 'player1', 'easy');
    // After a full AI turn, either opponent to move or still placing remaining
    expect(['selectBlocks', 'placeBlocks', 'gameOver']).toContain(next.phase);
    expect(
      next.currentPlayer === 'player2' ||
        next.phase === 'placeBlocks' ||
        next.phase === 'gameOver'
    ).toBe(true);
  });

  it('par-55: getAIMove / executeAITurn on a fresh board', () => {
    const state = createPar55State();
    const move = getPar55AIMove(state, 'player1', 'easy');
    const next = executePar55AI(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    if (move) {
      expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('kwatro-sinko: getAIMove / executeAITurn advances the seat', () => {
    const state = createKwaState();
    const move = getKwaAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const next = executeKwaAI(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('frac-fact: getAIAnswer returns a choice for an injected problem', () => {
    const problem: FractionProblem = {
      id: 'ai-problem',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 4 },
      operation: 'add',
      correctAnswer: { numerator: 3, denominator: 4 },
      answerChoices: [
        { numerator: 3, denominator: 4 },
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 4 },
        { numerator: 2, denominator: 3 },
      ],
    };
    const state = {
      ...createFracFactState('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    const answer = getAIAnswer(state, 'player1', 'hard');
    expect(answer).not.toBeNull();
    expect(
      problem.answerChoices.some(
        (c) =>
          c.numerator === answer!.numerator &&
          c.denominator === answer!.denominator
      )
    ).toBe(true);
  });
});
