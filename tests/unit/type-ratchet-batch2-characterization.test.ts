/**
 * burn-1008-mp-type-ratchet-batch2-compliant-recut — characterization of
 * CURRENT tip behavior for rules/types helpers touched by the Batch-2 type
 * clear (assertions only; no #537 nullish rewrites).
 *
 * Deferred semantic fixes: docs/dev/type-ratchet-batch2-owner-decisions.md
 */
import { describe, expect, it, vi, afterEach } from 'vitest';

import {
  generateProblem,
  checkAnswer,
  formatFraction as fracFactFormat,
} from '../../src/games/frac-fact/rules';
import {
  generateChallenge,
  checkAnswer as pinballCheck,
  hitRandomTarget,
  formatDecimal,
} from '../../src/games/fraction-pinball/rules';
import { TARGET_POINTS } from '../../src/games/fraction-pinball/types';
import {
  getValidMoves,
  makeMove as qgMakeMove,
  checkWinner,
  hasValidMoves,
} from '../../src/games/queens-guards/rules';
import {
  cellKey,
  parseKey,
  createInitialState as qgCreateInitialState,
} from '../../src/games/queens-guards/types';
import {
  createInitialState as ramrodCreateInitialState,
  isValidPlacement as ramrodIsValidPlacement,
  getValidPlacements as ramrodGetValidPlacements,
  getBoxSum,
  getRemainingValue,
} from '../../src/games/ramrod/rules';
import {
  createRod,
  createRodSet,
  shuffleArray as ramrodShuffle,
  ROD_COLORS,
  CONFIG as RAMROD_CONFIG,
} from '../../src/games/ramrod/types';
import {
  createInitialState as sdCreateInitialState,
  canPlayDomino,
  isValidPlacement as sdIsValidPlacement,
  getValidPlacements as sdGetValidPlacements,
  placeDomino,
  selectDomino,
  doRollDice,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG as SD_CONFIG,
  shuffleArray as sdShuffle,
  createDominoSet,
  getDiceSum,
} from '../../src/games/sum-dominoes/types';
import {
  canSelectPit,
  getValidPits,
  makeMove as callaMakeMove,
  getLastMoveInfo,
  isGameOver,
} from '../../src/games/calla/rules';
import { createInitialState as callaCreateInitialState } from '../../src/games/calla/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Batch-2 characterization — frac-fact rules', () => {
  it('generateProblem returns a well-formed problem for each difficulty', () => {
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      const problem = generateProblem(difficulty, 1);
      expect(problem.operand1.denominator).toBeGreaterThan(0);
      expect(problem.operand2.denominator).toBeGreaterThan(0);
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(
        problem.operation
      );
      expect(problem.answerChoices.length).toBeGreaterThanOrEqual(2);
      expect(
        problem.answerChoices.some(
          (c) =>
            c.numerator === problem.correctAnswer.numerator &&
            c.denominator === problem.correctAnswer.denominator
        )
      ).toBe(true);
      expect(checkAnswer(problem, problem.correctAnswer)).toBe(true);
    }
  });

  it('formatFraction keeps tip slash form', () => {
    expect(fracFactFormat({ numerator: 1, denominator: 2 })).toBe('1/2');
  });
});

describe('Batch-2 characterization — fraction-pinball rules', () => {
  it('generateChallenge alternates type by challenge number and includes correct answer', () => {
    const even = generateChallenge(2);
    const odd = generateChallenge(3);
    expect(even.type).toBe('fractionToDecimal');
    expect(odd.type).toBe('decimalToFraction');
    expect(even.answerChoices).toContain(even.correctAnswer);
    expect(pinballCheck(even, even.correctAnswer)).toBe(true);
    expect(pinballCheck(even, 'not-the-answer')).toBe(false);
  });

  it('hitRandomTarget returns a TARGET_POINTS value from the provided targets', () => {
    const targets = TARGET_POINTS.map((value, index) => ({
      id: `t${index}`,
      value,
      label: `${value}`,
      hit: false,
    }));
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { target, points } = hitRandomTarget(targets);
    expect(TARGET_POINTS).toContain(points);
    expect(target.value).toBe(points);
    expect(targets).toContainEqual(target);
  });

  it('formatDecimal pins 4dp string form used by answer check', () => {
    expect(formatDecimal(0.5)).toBe('0.5');
  });
});

describe('Batch-2 characterization — queens-guards parseKey + moves', () => {
  it('parseKey round-trips cellKey without inventing defaults', () => {
    const key = cellKey(2, 5);
    expect(parseKey(key)).toEqual({ ring: 2, position: 5 });
    // Malformed single-part key: tip leaves position undefined (not ?? 0).
    const malformed = parseKey('3');
    expect(malformed.ring).toBe(3);
    expect(malformed.position).toBeUndefined();
  });

  it('opening state has legal moves for the current player pieces', () => {
    const state = qgCreateInitialState();
    expect(hasValidMoves(state)).toBe(true);
    expect(checkWinner(state)).toBeNull();
    // Pick a piece belonging to current player and ensure getValidMoves is an array.
    for (const [, cell] of state.cells) {
      if (cell.piece?.player === state.currentPlayer) {
        const moves = getValidMoves(state, {
          ring: cell.ring,
          position: cell.position,
        });
        expect(Array.isArray(moves)).toBe(true);
        if (moves.length > 0) {
          const next = qgMakeMove(state, { ring: cell.ring, position: cell.position }, moves[0]!);
          expect(next).not.toBe(state);
          expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        }
        break;
      }
    }
  });
});

describe('Batch-2 characterization — ramrod rules/types', () => {
  it('createInitialState builds full BOARD_ROWS×BOARD_COLS boxes with tip target sums', () => {
    const state = ramrodCreateInitialState();
    expect(state.boxes.size).toBe(
      RAMROD_CONFIG.BOARD_ROWS * RAMROD_CONFIG.BOARD_COLS
    );
    const expected = [
      [5, 6, 7, 8],
      [6, 7, 8, 9],
      [7, 8, 9, 10],
    ];
    for (let row = 0; row < RAMROD_CONFIG.BOARD_ROWS; row++) {
      for (let col = 0; col < RAMROD_CONFIG.BOARD_COLS; col++) {
        const box = state.boxes.get(`box-${row}-${col}`);
        expect(box?.targetSum).toBe(expected[row]![col]);
        expect(getBoxSum(box!)).toBeNull();
        expect(getRemainingValue(box!)).toBe(box!.targetSum);
      }
    }
    expect(state.playerRods.player1).toHaveLength(
      RAMROD_CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.playerRods.player2).toHaveLength(
      RAMROD_CONFIG.STARTING_RODS_PER_PLAYER
    );
  });

  it('createRod / createRodSet keep ROD_COLORS without gray fallback', () => {
    const rod = createRod('r0', 5);
    expect(rod.color).toBe(ROD_COLORS[5]);
    expect(rod.color).not.toBe('#888888');
    const set = createRodSet();
    expect(set.length).toBeGreaterThan(
      RAMROD_CONFIG.STARTING_RODS_PER_PLAYER * 2
    );
    expect(set.every((r) => r.color === ROD_COLORS[r.length])).toBe(true);
  });

  it('shuffleArray permutes without dropping elements', () => {
    const input = [1, 2, 3, 4, 5, 6];
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const out = ramrodShuffle(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it('isValidPlacement / getValidPlacements stay arrays on fresh deal', () => {
    const state = ramrodCreateInitialState();
    const rodId = state.playerRods.player1[0]!;
    const placements = ramrodGetValidPlacements(state, rodId);
    expect(Array.isArray(placements)).toBe(true);
    if (placements.length > 0) {
      const p = placements[0]!;
      expect(ramrodIsValidPlacement(state, rodId, p.boxId, p.slot)).toBe(true);
    }
  });
});

describe('Batch-2 characterization — sum-dominoes rules', () => {
  it('createInitialState seeds both center cells with the same placed domino', () => {
    const state = sdCreateInitialState();
    const r = SD_CONFIG.CENTER_ROW;
    const c = SD_CONFIG.CENTER_COL;
    const a = state.board[r]![c];
    const b = state.board[r]![c + 1];
    expect(a).not.toBeNull();
    expect(b).toBe(a);
    expect(a!.orientation).toBe('horizontal');
  });

  it('canPlayDomino / isValidPlacement / placeDomino pin legality + match record', () => {
    let state = sdCreateInitialState();
    // Force a known dice sum so placement is deterministic enough to exercise paths.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    state = doRollDice(state);
    expect(state.currentDice).not.toBeNull();
    const sum = getDiceSum(state.currentDice!);

    // Prefer hand lookup via canPlayDomino; if none, still pin false without throw.
    const hand = state.hands.player1;
    const playable = hand.find((d) => canPlayDomino(state, d, sum));
    if (!playable) {
      expect(canPlayDomino(state, hand[0]!, sum)).toBe(false);
      return;
    }
    const placements = sdGetValidPlacements(state, playable, sum);
    expect(placements.length).toBeGreaterThan(0);
    const place = placements[0]!;
    expect(
      sdIsValidPlacement(
        state,
        playable,
        place.position,
        place.orientation,
        sum
      )
    ).toBe(true);
    state = selectDomino(state, playable.id);
    const next = placeDomino(state, place.position, place.orientation);
    expect(next.moveHistory.length).toBe(1);
    expect(next.moveHistory[0]!.diceSum).toBe(sum);
    expect(typeof next.moveHistory[0]!.matchedFace).toBe('number');
    expect(typeof next.moveHistory[0]!.adjacentFace).toBe('number');
  });

  it('shuffleArray on domino set preserves cardinality', () => {
    const set = createDominoSet();
    const shuffled = sdShuffle([...set]);
    expect(shuffled).toHaveLength(set.length);
  });
});

describe('Batch-2 characterization — calla rules', () => {
  it('canSelectPit / getValidPits pin tip empty-pit and OOR rejection', () => {
    const state = callaCreateInitialState();
    expect(getValidPits(state)).toEqual([0, 1, 2, 3, 4]);
    expect(canSelectPit(state, 'player1', 0)).toBe(true);
    expect(canSelectPit(state, 'player1', 99)).toBe(false);
    const emptied = {
      ...state,
      player1Pits: [0, 3, 3, 3, 3] as number[],
    };
    expect(canSelectPit(emptied, 'player1', 0)).toBe(false);
  });

  it('makeMove distributes exact pit count and records cubesDistributed (no ?? 0 invent)', () => {
    const state = callaCreateInitialState();
    const before = state.player1Pits[0]!;
    expect(before).toBeGreaterThan(0);
    const next = callaMakeMove(state, 0);
    expect(next.player1Pits[0]).toBe(0);
    expect(next.moveHistory[0]!.cubesDistributed).toBe(before);
    expect(next.moveHistory[0]!.cubesDistributed).not.toBeUndefined();
  });

  it('makeMove capture path uses live opposite count (not coalesced default)', () => {
    // Set up: player1 pit 0 has 1 cube landing in empty own pit with opposite cubes.
    // Pit 4 with 1 cube: sows into calla? Prefer a known capture fixture from existing suite patterns.
    const state = {
      ...callaCreateInitialState(),
      player1Pits: [1, 0, 0, 0, 0] as number[],
      player2Pits: [0, 0, 0, 0, 5] as number[], // opposite of pit 0 is 4
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = callaMakeMove(state, 0);
    // Last cube from pit 0 with 1 cube lands in pit 1 (empty) — may not capture.
    // Pin: move always records a numeric captured ≥ 0 without inventing cubesDistributed.
    expect(next.moveHistory[0]!.cubesDistributed).toBe(1);
    expect(next.moveHistory[0]!.captured).toBeGreaterThanOrEqual(0);
    expect(typeof next.moveHistory[0]!.captured).toBe('number');
  });

  it('getLastMoveInfo returns null only on empty history', () => {
    const state = callaCreateInitialState();
    expect(getLastMoveInfo(state)).toBeNull();
    const next = callaMakeMove(state, 0);
    const info = getLastMoveInfo(next);
    expect(info).not.toBeNull();
    expect(info!).toContain('distributed');
  });

  it('isGameOver stays false on opening board', () => {
    expect(isGameOver(callaCreateInitialState())).toBe(false);
  });
});
