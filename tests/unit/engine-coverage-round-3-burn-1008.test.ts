/**
 * burn-1008-mp-engine-coverage-round-3 — characterization for the NEXT
 * lowest-covered NON-AI engine modules after #574 (round 2).
 *
 * Themes: legal-move generation, win/draw detection, scoring tallies,
 * state transitions, serialization. Pins CURRENT behavior only.
 * Does not change engine source. Dead/defensive arms → it.todo.
 *
 * Stacks on #574; avoids duplicating #562 / #574 / #482 suites.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { shuffleArray as fabShuffle } from '../../src/games/fab-a-diffy/types';
import {
  calculateResult,
  hasAnyValidMove,
  createInitialState as createFab,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

import { shuffleArray as parShuffle } from '../../src/games/par-55/types';

import {
  ISLAND_VALUES,
  createInitialState as createRemainder,
} from '../../src/games/remainder-islands/types';
import {
  performRoll as remRoll,
  selectIsland as remSelect,
  findValidIslands,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialGameState,
  getCurrentPhaseMessage,
  getKingPosition,
  getSupply,
  selectKing,
  endTurn,
  resetGame,
  type GameState as KingsState,
  type TurnPhase,
} from '../../src/games/kings-quadraphages/game-state';
import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  validateSerializedState,
  getSaveInfo,
  generateSaveFileName,
} from '../../src/games/kings-quadraphages/serialization';

import {
  createInitialState as createFiar,
  createFiarBoard,
  getNodesInDirection,
  getBoardDirections,
  getDirections,
  chipsRemaining,
  areConnected,
  getConnectedNodes,
} from '../../src/games/fiar/types';
import {
  canPlaceChip,
  placeChip as fiarPlace,
  checkWinner as fiarWinner,
  isDraw as fiarIsDraw,
  normalizeSelectedChipKind,
  setSelectedChipKind,
} from '../../src/games/fiar/rules';

import {
  generateChallenge,
  formatDecimal,
  formatFraction,
  startGame as pinballStart,
  submitAnswer as pinballSubmit,
  nextChallenge as pinballNext,
} from '../../src/games/fraction-pinball/rules';
import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';

import {
  createInitialState as createPent,
  BOARD_SIZE as PENT_BOARD,
  type PentEmInState,
} from '../../src/games/pent-em-in/types';
import {
  canPlayerMove as pentCanMove,
  selectPiece as pentSelect,
  getCurrentOrientationPlacements as pentPlacements,
  placePiece as pentPlace,
} from '../../src/games/pent-em-in/rules';

import {
  generateProblem,
  startGame as fracStart,
  submitAnswer as fracSubmit,
  nextProblem as fracNext,
  checkAnswer as fracCheck,
  getOperationSymbol,
  formatFraction as fracFormat,
} from '../../src/games/frac-fact/rules';
import { createInitialState as createFrac } from '../../src/games/frac-fact/types';

import {
  createInitialState as createStars,
  selectCard as starsSelect,
  placeCard as starsPlace,
  getValidPlacements as starsValids,
  hasValidMoves as starsHasMoves,
  passTurn as starsPass,
  clearSelection as starsClear,
} from '../../src/games/stars-bars/rules';
import type {
  StarsState,
  AttributeCard,
  BoardCell,
} from '../../src/games/stars-bars/types';

import {
  createChainBucket,
  createInitialState as createStarTrack,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getChainLandingSpace,
  isGameOver as starOver,
  getProgress,
} from '../../src/games/star-track/rules';

import {
  isGoldbachNumber,
  isPrime,
  factorial,
  generateExpressions,
} from '../../src/games/prime-gold/types';
import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primeValids,
  placeChip as primePlace,
  passTurn as primePass,
  hasValidMoves as primeHasMoves,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  getValidPits,
  makeMove as callaMove,
  isGameOver as callaOver,
  getPhaseMessage as callaPhase,
  settleNoValidMoves,
} from '../../src/games/calla/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie as juggleSelectDie,
  selectShape as juggleSelectShape,
  rotateShape,
  flipShape,
  abandonPlacement,
  getCurrentOrientationPlacements as juggleOrients,
  selectedShapeFitsAnywhere,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

import {
  jsonRoundTrip,
  canonMoves,
  stripLazyCaches,
} from './helpers/state-roundtrip';
import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';

// =============================================================================
// 1. fab-a-diffy/types.ts — Fisher-Yates hole / undefined-element guard
// =============================================================================

describe('engine-coverage-round-3 — fab-a-diffy/types shuffle', () => {
  it('shuffleArray skips when an element is undefined (hole-guard)', () => {
    const input: Array<number | undefined> = [1, undefined, 3, 4, 5];
    const out = fabShuffle(input);
    expect(out).toHaveLength(5);
    // undefined may move or stay; length preserved; defined values retained
    expect(out.filter((x) => x !== undefined).sort()).toEqual([1, 3, 4, 5]);
  });
});

// =============================================================================
// 2. par-55/types.ts — same shuffle guard
// =============================================================================

describe('engine-coverage-round-3 — par-55/types shuffle', () => {
  it('shuffleArray continues when swapped slots hold undefined', () => {
    const input: Array<string | undefined> = ['a', undefined, 'c', 'd'];
    const out = parShuffle(input);
    expect(out).toHaveLength(4);
    expect(out.filter((x) => typeof x === 'string').sort()).toEqual([
      'a',
      'c',
      'd',
    ]);
  });
});

// =============================================================================
// 3. remainder-islands/types.ts — ISLAND_VALUES undefined skip
// =============================================================================

describe('engine-coverage-round-3 — remainder-islands/types', () => {
  afterEach(() => {
    // Restore table if a test punched a hole
    for (let i = 0; i < 8; i++) {
      if (ISLAND_VALUES[i] === undefined) {
        ISLAND_VALUES[i] = i + 2;
      }
    }
    if (ISLAND_VALUES.length < 8) {
      while (ISLAND_VALUES.length < 8) {
        ISLAND_VALUES.push(ISLAND_VALUES.length + 2);
      }
    }
  });

  it('createInitialState skips undefined ISLAND_VALUES slots (forged hole)', () => {
    const saved = ISLAND_VALUES[3];
    // Punch a hole so value === undefined continue fires
    delete (ISLAND_VALUES as Array<number | undefined>)[3];
    const state = createRemainder();
    expect(state.islands.length).toBeGreaterThan(0);
    // Every island still has a defined numeric value
    for (const isle of state.islands) {
      expect(typeof isle.value).toBe('number');
    }
    ISLAND_VALUES[3] = saved ?? 5;
  });

  it('roll → valid islands → selectIsland scoring handoff', () => {
    let state = createRemainder();
    state = remRoll(state);
    expect(state.phase).toBe('selectIsland');
    expect(state.currentRoll).not.toBeNull();
    expect(state.validIslands.length).toBeGreaterThan(0);
    expect(
      findValidIslands(state, state.currentRoll!.total).sort()
    ).toEqual([...state.validIslands].sort());
    const before = state.player1Score;
    state = remSelect(state, state.validIslands[0]!);
    expect(
      state.phase === 'rolling' || state.phase === 'gameOver'
    ).toBe(true);
    expect(state.player1Score + state.player2Score).toBeGreaterThanOrEqual(
      before
    );
  });
});

// =============================================================================
// 4. kings-quadraphages/game-state.ts — forged phase default + serialize
// =============================================================================

describe('engine-coverage-round-3 — kings game-state / serialization', () => {
  it('getCurrentPhaseMessage default arm for forged unknown TurnPhase', () => {
    const open = createInitialGameState();
    const forged = {
      ...open,
      turnPhase: 'notAPhase' as TurnPhase,
    };
    // Current behavior: default never-assign returns the forged string
    expect(getCurrentPhaseMessage(forged)).toBe('notAPhase');
  });

  it('supply + king lookup + reset/endTurn edges', () => {
    const open = createInitialGameState();
    expect(getSupply(open, 'player1')).toBe(30);
    expect(getSupply(open, 'player2')).toBe(30);
    expect(getKingPosition(open, 'player1')).toEqual({ row: 1, col: 5 });
    expect(getKingPosition(open, 'player2')).toEqual({ row: 9, col: 5 });

    const selected = selectKing(open);
    expect(selected.turnPhase).toBe('moveKing');

    expect(resetGame().moveHistory).toEqual([]);
  });

  it('serialize / deserialize / validate / save-info round-trip', () => {
    const open = createInitialGameState();
    const withMeta = serializeGameState(open, {
      gameName: 'r3',
      notes: 'characterization',
    });
    expect(withMeta.metadata?.gameName).toBe('r3');
    const back = deserializeGameState(withMeta);
    expect(back.player1Supply).toBe(30);
    expect(back.currentPlayer).toBe('player1');

    const json = gameStateToJSON(open, { player1Name: 'A' });
    const fromJson = gameStateFromJSON(json);
    expect(fromJson.board.length).toBe(9);

    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState({})).toBe(false);
    expect(validateSerializedState(withMeta)).toBe(true);
    expect(
      validateSerializedState({ ...withMeta, currentPlayer: 'nope' })
    ).toBe(false);
    expect(validateSerializedState({ ...withMeta, turnPhase: 'nope' })).toBe(
      false
    );
    expect(
      validateSerializedState({ ...withMeta, board: [[null]] })
    ).toBe(false);

    expect(() =>
      deserializeGameState({ ...withMeta, version: 99 })
    ).toThrow(/Unsupported save version/);
    expect(() =>
      deserializeGameState({ ...withMeta, board: [[null]] })
    ).toThrow(/Invalid board size/);

    const info = getSaveInfo(withMeta);
    expect(info.currentPlayer).toBe('Player 1');
    expect(info.isGameOver).toBe(false);
    expect(info.metadata?.gameName).toBe('r3');

    const p2Info = getSaveInfo({
      ...withMeta,
      currentPlayer: 'player2',
      turnPhase: 'gameOver',
      winner: 'player2',
    });
    expect(p2Info.currentPlayer).toBe('Player 2');
    expect(p2Info.isGameOver).toBe(true);

    expect(generateSaveFileName('kings')).toMatch(/^kings-\d{4}-\d{2}-\d{2}/);
  });

  it('endTurn with zero opponent supply settles tie when no trap', () => {
    const open = createInitialGameState();
    const drained: KingsState = {
      ...open,
      player1Supply: 0,
      player2Supply: 0,
      turnPhase: 'placeQuadraphage',
    };
    const settled = endTurn(drained);
    expect(settled.turnPhase).toBe('gameOver');
  });
});

// =============================================================================
// 5. fiar/types.ts — prevId undefined defensive + helpers
// =============================================================================

describe('engine-coverage-round-3 — fiar/types', () => {
  it('getNodesInDirection hits prevId===undefined when startId key is undefined', () => {
    const board = createFiarBoard();
    board.nodes.set(undefined as unknown as string, {
      id: undefined as unknown as string,
      x: 0,
      y: 0,
      chip: null,
      chipKind: null,
    });
    const out = getNodesInDirection(
      board,
      undefined as unknown as string,
      80,
      0
    );
    expect(out).toEqual([]);
  });

  it('chipsRemaining / connections / directions / spacing fallback', () => {
    const state = createFiar();
    expect(chipsRemaining(state.chipInventory.player1)).toBe(7);
    const nodeId = [...state.board.nodes.keys()][0]!;
    const connected = getConnectedNodes(state.board, nodeId);
    expect(Array.isArray(connected)).toBe(true);
    if (connected.length > 0) {
      expect(areConnected(state.board, nodeId, connected[0]!)).toBe(true);
    }
    expect(getDirections(40).length).toBe(8);
    expect(getBoardDirections(state.board).length).toBe(8);
    // spacing 0 is falsy → CONFIG_SPACING_FALLBACK arm
    expect(
      getBoardDirections({ ...state.board, spacing: 0 }).length
    ).toBe(8);
  });

  it('unknown startId returns []; allowYellowCrossing option accepted', () => {
    const board = createFiarBoard();
    expect(getNodesInDirection(board, 'missing-node', 80, 0)).toEqual([]);
    const id = [...board.nodes.keys()][0]!;
    const withYellow = getNodesInDirection(board, id, 80, 0, {
      allowYellowCrossing: true,
    });
    expect(Array.isArray(withYellow)).toBe(true);
  });
});

// =============================================================================
// 6. fab-a-diffy/rules.ts — calculateResult catch + scoring-ish results
// =============================================================================

describe('engine-coverage-round-3 — fab-a-diffy/rules', () => {
  it('calculateResult catch returns null when operand access throws', () => {
    const boom = new Proxy(
      {} as { numerator: number; denominator: number },
      {
        get() {
          throw new Error('forged throw');
        },
      }
    );
    expect(
      calculateResult(boom, { numerator: 1, denominator: 2 }, 'add')
    ).toBeNull();
  });

  it('calculateResult divide-by-zero numerator guard; unknown op null', () => {
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 0, denominator: 3 },
        'divide'
      )
    ).toBeNull();
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        'nope' as 'add'
      )
    ).toBeNull();
  });

  it('getPossibleResults + hasAnyValidMove on opening board', () => {
    const open = createFab();
    const bars = [...open.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);
    const results = getPossibleResults(bars[0]!, bars[1]!);
    expect(results.length).toBeGreaterThan(0);
    expect(hasAnyValidMove(open)).toBe(true);

    const lonely: typeof open = {
      ...open,
      fractionBars: new Map<string, FractionBar>([
        [
          'only',
          {
            ...bars[0]!,
            id: 'only',
            used: false,
          },
        ],
      ]),
    };
    expect(hasAnyValidMove(lonely)).toBe(false);
  });

  it.todo(
    'hasAnyValidMove left/right === undefined continue — Array.from+filter never yields holes'
  );
});

// =============================================================================
// 7. fraction-pinball/rules.ts — fill-while duplicate arm + zero-numerator || 1
// =============================================================================

describe('engine-coverage-round-3 — fraction-pinball', () => {
  afterEach(() => {
    // Strip any injected zero-numerator fraction
    for (let i = COMMON_FRACTIONS.length - 1; i >= 0; i--) {
      if (COMMON_FRACTIONS[i]?.numerator === 0) {
        COMMON_FRACTIONS.splice(i, 1);
      }
    }
  });

  it('generateChallenge(even): fill-while hits seen.has true (duplicate) arm', () => {
    let n = 0;
    const orig = Math.random;
    Math.random = () => {
      n += 1;
      if (n === 1) return 0; // fraction pick
      if (n <= 31) return 0; // strategy loop — starve unique wrongs
      // fill: one unique, one duplicate (!seen false), then ascending uniques
      if (n === 32) return 0.01;
      if (n === 33) return 0.01; // duplicate → covers seen.has true arm
      return Math.min(0.999, ((n - 31) % 97) / 100);
    };
    try {
      const ch = generateChallenge(2); // even → fractionToDecimal → wrong decimals
      expect(ch.type).toBe('fractionToDecimal');
      expect(ch.answerChoices.length).toBe(4);
      expect(formatDecimal(ch.decimal)).toBeTruthy();
    } finally {
      Math.random = orig;
    }
  });

  it('generateChallenge(odd) with zero-numerator correct hits || 1 arm', () => {
    COMMON_FRACTIONS.push({ numerator: 0, denominator: 1 });
    let n = 0;
    const orig = Math.random;
    // Force pick of the injected fraction (last index)
    const idx = COMMON_FRACTIONS.length - 1;
    const convertible = COMMON_FRACTIONS.filter((f) => {
      const decimal = f.numerator / f.denominator;
      const rounded = Math.round(decimal * 10000) / 10000;
      return Math.abs(decimal - rounded) < 0.00001;
    });
    const zeroIdx = convertible.findIndex((f) => f.numerator === 0);
    expect(zeroIdx).toBeGreaterThanOrEqual(0);
    Math.random = () => {
      n += 1;
      if (n === 1) {
        // pick zero fraction among convertible
        return (zeroIdx + 0.5) / convertible.length;
      }
      // strategies + shuffle: cycle
      return ((n * 17) % 97) / 100;
    };
    try {
      const ch = generateChallenge(1); // odd → decimalToFraction → wrong fractions
      expect(ch.type).toBe('decimalToFraction');
      expect(ch.fraction.numerator).toBe(0);
      expect(ch.answerChoices.length).toBe(4);
      expect(formatFraction(ch.fraction)).toBeTruthy();
    } finally {
      Math.random = orig;
      void idx;
    }
  });

  it('start → correct answer → nextChallenge scoring transition', () => {
    let state = pinballStart(createPinball());
    expect(state.phase).toBe('answering');
    const correct = state.currentChallenge!.correctAnswer;
    state = pinballSubmit(state, correct);
    expect(state.isCorrect).toBe(true);
    state = pinballNext(state);
    expect(
      state.phase === 'answering' || state.phase === 'gameOver'
    ).toBe(true);
  });
});

// =============================================================================
// 8. pent-em-in/rules.ts — !pieceShape continue after known-shape probe
// =============================================================================

describe('engine-coverage-round-3 — pent-em-in', () => {
  function fullyJammed(): PentEmInState {
    const open = createPent();
    const board = open.board.map((row) =>
      row.map((c) => ({
        ...c,
        occupied: true,
        owner: 'player2' as const,
        pieceId: 'block',
      }))
    );
    return { ...open, board };
  }

  it('canPlayerMove skips unknown mid-list shapes when first shape is known', () => {
    const jammed: PentEmInState = {
      ...fullyJammed(),
      player1Pieces: {
        available: ['X', 'bogus-shape', 'I5'],
        placed: [],
      },
    };
    // First shape known → no L137 short-circuit; bogus mid-list → L142 continue
    expect(pentCanMove(jammed, 'player1')).toBe(false);
  });

  it('select → placements on open board; place transitions', () => {
    let state = pentSelect(createPent(), 'V');
    expect(state.phase).toBe('placePiece');
    const spots = pentPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = pentPlace(
      state,
      'V',
      spots[0]!,
      state.selectedRotation,
      state.selectedFlipped
    );
    expect(
      state.phase === 'selectPiece' || state.phase === 'gameOver'
    ).toBe(true);
  });
});

// =============================================================================
// 9. frac-fact/rules.ts — divide operand2.numerator===0 guard
// =============================================================================

describe('engine-coverage-round-3 — frac-fact', () => {
  afterEach(() => {
    for (let i = COMMON_FRACTIONS.length - 1; i >= 0; i--) {
      if (COMMON_FRACTIONS[i]?.numerator === 0) {
        COMMON_FRACTIONS.splice(i, 1);
      }
    }
  });

  it('generateProblem(hard) hits divide zero-numerator operand2 guard', () => {
    COMMON_FRACTIONS.push({ numerator: 0, denominator: 2 });
    let n = 0;
    const orig = Math.random;
    Math.random = () => {
      n += 1;
      // hard ops: [add,sub,mul,divide] — force divide (index 3)
      if (n === 1) return 0.9;
      // operand1: any non-zero (index 0)
      if (n === 2) return 0;
      // operand2: last = zero numerator
      if (n === 3) return 0.999;
      return ((n * 13) % 89) / 100;
    };
    try {
      const p = generateProblem('hard', 1);
      expect(p.operation).toBe('divide');
      expect(p.operand2.numerator).not.toBe(0);
      expect(p.answerChoices.length).toBe(4);
      expect(getOperationSymbol('divide')).toBeTruthy();
      expect(fracFormat(p.correctAnswer)).toBeTruthy();
    } finally {
      Math.random = orig;
    }
  });

  it('start → submit → nextProblem state transition', () => {
    let state = fracStart(createFrac());
    const problem = state.currentProblem!;
    const correct = problem.answerChoices.find((a) =>
      fracCheck(problem, a)
    );
    expect(correct).toBeTruthy();
    state = fracSubmit(state, correct!);
    expect(state.phase).toBe('showingResult');
    state = fracNext(state);
    expect(state.phase === 'playing' || state.phase === 'gameOver').toBe(true);
  });
});

// =============================================================================
// 10. stars-bars/rules.ts — !adjCell.card continue via undefined card
// =============================================================================

describe('engine-coverage-round-3 — stars-bars', () => {
  it('placeCard scores when adjacent cell has undefined card (filter hole)', () => {
    const open = createStars();
    const card = open.playerHands.player1[0]!;
    // Seed one real card at (2,2), and an adjacent cell with card: undefined
    // so filter (c.card !== null) keeps it, then !adjCell.card continue fires.
    const cells: BoardCell[][] = open.cells.map((row) =>
      row.map((c) => ({ ...c }))
    );
    const seed: AttributeCard = {
      id: 'seed',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    cells[2]![2] = {
      ...cells[2]![2]!,
      card: seed,
      owner: 'player2',
    };
    cells[2]![3] = {
      ...cells[2]![3]!,
      card: undefined as unknown as null,
      owner: null,
    };

    let state: StarsState = {
      ...open,
      cells,
      selectedCard: card,
      phase: 'placingCard',
    };
    // Place orthogonally adjacent to seed at (2,1) — also touches undefined cell
    const spots = starsValids(state);
    expect(spots.length).toBeGreaterThan(0);
    // Prefer a spot next to row2 so scoring walks the undefined neighbor
    const spot =
      spots.find((p) => p.row === 2 && (p.col === 1 || p.col === 3)) ??
      spots[0]!;
    state = starsPlace(state, spot.row, spot.col);
    expect(
      state.phase === 'selectingCard' || state.phase === 'gameOver'
    ).toBe(true);
    expect(state.playerScores.player1).toBeGreaterThanOrEqual(0);
  });

  it('legal placements / pass / clear on opening', () => {
    const open = createStars();
    expect(starsHasMoves(open)).toBe(true);
    const hand = open.playerHands.player1[0]!;
    const selected = starsSelect(open, hand.id);
    expect(starsValids(selected).length).toBeGreaterThan(0);
    expect(starsClear(selected).selectedCard).toBeNull();
    expect(starsPass(open).currentPlayer).toBe('player2');
  });
});

// =============================================================================
// 11. star-track/types.ts — shuffle undefined via punched bucket
// =============================================================================

describe('engine-coverage-round-3 — star-track', () => {
  it('createChainBucket returns 24 shuffled chains; draw/select transitions', () => {
    const bucket = createChainBucket();
    expect(bucket.length).toBe(24);
    expect(new Set(bucket.map((c) => c.id)).size).toBe(24);

    let state = createStarTrack();
    expect(starOver(state)).toBe(false);
    expect(getProgress(state, 'player1')).toBe(0);
    state = drawChains(state);
    expect(state.drawnChains).not.toBeNull();
    expect(state.drawnChains![0]!.length).toBeGreaterThan(0);
    const land = getChainLandingSpace(state, 0);
    expect(typeof land).toBe('number');
    state = selectChain(state, 0);
    expect(
      state.phase === 'drawChains' || state.phase === 'gameOver'
    ).toBe(true);
  });

  it.todo(
    'shuffleArray a===undefined||b===undefined continue — private Fisher-Yates; dense bucket only (no safe public inject)'
  );
});

// =============================================================================
// 12. prime-gold — Goldbach / expressions / placement scoring
// =============================================================================

describe('engine-coverage-round-3 — prime-gold', () => {
  it('isGoldbachNumber / isPrime / factorial / generateExpressions pins', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isGoldbachNumber(4)).toBe(true);
    expect(isGoldbachNumber(3)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
    expect(factorial(0)).toBe(1);
    expect(Number.isNaN(factorial(-1))).toBe(true);
    expect(Number.isNaN(factorial(11))).toBe(true);
    const exprs = generateExpressions(1, 2, 3);
    expect(exprs.length).toBeGreaterThan(0);
  });

  it('roll → legal placements → place or pass transitions', () => {
    let state = createPrime();
    state = primeRoll(state);
    expect(state.diceRoll).not.toBeNull();
    const spots = primeValids(state);
    if (spots.length > 0) {
      const before = state.playerChips.player1;
      state = primePlace(state, spots[0]!.value, spots[0]!.expr);
      expect(state.playerChips.player1 + state.playerChips.player2).toBeLessThan(
        before + state.playerChips.player2 + 1
      );
      expect(state.moveHistory.length).toBeGreaterThan(0);
    } else {
      expect(primeHasMoves(state)).toBe(false);
      state = primePass(state);
      expect(state.currentPlayer).toBe('player2');
    }
    expect(findCellByValue(createPrime(), 1)).not.toBeNull();
  });

  it.todo(
    'createBoard val>0 false arm — spiral fills every cell 1..BOARD_SIZE²'
  );
  it.todo(
    'isGoldbachNumber loop-exhaust return false — no small even Goldbach counterexample under isPrime'
  );
});

// =============================================================================
// 13. calla — sow / settle / phase (characterization; L99 remains dead)
// =============================================================================

describe('engine-coverage-round-3 — calla', () => {
  it('opening valid pits → makeMove → phase/over queries', () => {
    let state = createCalla();
    const pits = getValidPits(state);
    expect(pits.length).toBeGreaterThan(0);
    state = callaMove(state, pits[0]!);
    expect(callaOver(state) || state.phase === 'selectPit').toBe(true);
    expect(typeof callaPhase(state)).toBe('string');
  });

  it('settleNoValidMoves on empty-seat forge', () => {
    const open = createCalla();
    const emptyP1 = {
      ...open,
      player1Pits: [0, 0, 0, 0, 0],
      phase: 'selectPit' as const,
    };
    const settled = settleNoValidMoves(emptyP1);
    expect(settled.phase).toBe('gameOver');
  });

  it.todo(
    'sow position < PITS_PER_SIDE*2+1 false arm — wrap resets before position≥11'
  );
});

// =============================================================================
// 14. juggle — rotate/flip/abandon transitions (L130 orient early return dead)
// =============================================================================

describe('engine-coverage-round-3 — juggle', () => {
  it('roll → select die/shape → rotate/flip → abandon', () => {
    let state = juggleRoll(createJuggle());
    expect(state.currentDice).not.toBeNull();
    state = juggleSelectDie(state, 0);
    if (state.phase === 'selectingShape' && state.selectedCategory) {
      const pool = SHAPE_POOLS[state.selectedCategory];
      expect(pool.length).toBeGreaterThan(0);
      state = juggleSelectShape(state, pool[0]!);
    }
    if (state.phase === 'placing' && state.selectedShape) {
      const rotated = rotateShape(state);
      expect(rotated.selectedRotation).not.toBe(state.selectedRotation);
      if (state.selectedShape.canFlip) {
        expect(flipShape(state).selectedFlipped).toBe(!state.selectedFlipped);
      }
      expect(juggleOrients(state).length).toBeGreaterThanOrEqual(0);
      expect(typeof selectedShapeFitsAnywhere(state)).toBe('boolean');
      const abandoned = abandonPlacement(state);
      expect(abandoned.phase).toBe('selectingShape');
    }
  });

  it.todo(
    'orientSelectedShapeToFit early return — public callers always set placing+shape'
  );
});

// =============================================================================
// Undo/serialize invariants — round-3 engines
// =============================================================================

describe('engine-coverage-round-3 — undo/serialize legal-move invariants', () => {
  const ids = [
    'remainder-islands',
    'fiar',
    'stars-bars',
    'prime-gold',
    'calla',
    'fab-a-diffy',
    'frac-fact',
    'fraction-pinball',
  ];

  for (const id of ids) {
    it(`${id}: snapshot undo + round-trip preserve legal-move sets`, () => {
      const adapter = ALL_GAME_ADAPTERS.find((a) => a.id === id);
      expect(adapter).toBeTruthy();
      const initial = adapter!.create();
      const moves0 = adapter!.legalMoves(initial);
      expect(moves0.length).toBeGreaterThan(0);
      const after = adapter!.apply(initial, moves0[0]!);
      expect(canonMoves(adapter!.legalMoves(initial))).toBe(canonMoves(moves0));
      const trip = adapter!.roundTrip(after);
      expect(adapter!.normalize(trip)).toEqual(adapter!.normalize(after));
      expect(canonMoves(adapter!.legalMoves(trip))).toBe(
        canonMoves(adapter!.legalMoves(after))
      );
      void stripLazyCaches;
      void jsonRoundTrip;
      void PENT_BOARD;
    });
  }
});
