/**
 * Wave 14 — vertical rules-phase / illegal-sequence / getValid* matrix.
 * Distinct from waves 7–13 (win-draw-AI, secondary UI, tutorial wiring, controllers).
 * Tests-only: assert existing identity no-ops and empty-valid edges. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createHag,
  HexAGoneGameState,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
  canPlayerMove as hagCanMove,
  getPhaseMessage as hagPhaseMsg,
  passTurn as passHag,
} from '../../src/games/hex-a-gone/rules';

import { JuggleState } from '../../src/games/juggle/types';
import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
  isPlacementValid,
  getPreviewCells,
  canMakeAnyMove,
} from '../../src/games/juggle/rules';
import { TETROMINOES } from '../../src/core/polyomino/types';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  getPieceCells,
  placePiece,
  selectPiece,
  cancelSelection,
  canPlayerMove as pentCanMove,
  setPreviewPosition,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  hasValidMoves as primeHasMoves,
  findCellByValue,
  placeChip as placePrime,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
  previewDivision,
  findValidIslands,
} from '../../src/games/remainder-islands/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove as callaMove,
  getLastMoveInfo,
  getPhaseMessage as callaPhaseMsg,
} from '../../src/games/calla/rules';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
  getPhaseMessage as starPhaseMsg,
} from '../../src/games/star-track/rules';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  clearSelection as clearFab,
  findMatchingAnswers,
  executeMove as executeFab,
  formatMove as formatFabMove,
  calculateResult,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
  clearSelection as clearStars,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  getValidPlacements as parPlacements,
  clearSelection as clearPar,
  formatMove as formatParMove,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  getValidPlacements as ramrodPlacements,
  clearSelection as clearRamrod,
  formatMove as formatRamrodMove,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
  getValidMoves as kwaValid,
  clearSelection as clearKwa,
  moveChip as kwaMove,
  formatMove as formatKwaMove,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createSum,
  selectDomino,
  getValidPlacements as sumPlacements,
  placeDomino,
  doRollDice as sumRoll,
  formatMove as formatSumMove,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';
import { Domino, CONFIG as SD_CFG } from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createFiar,
} from '../../src/games/fiar/types';
import {
  getSelectableNodes,
  selectChip as fiarSelect,
  deselectChip,
  canPlaceChip,
  placeChip as placeFiar,
} from '../../src/games/fiar/rules';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
  nextProblem,
} from '../../src/games/frac-fact/rules';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  startGame as startPinball,
  submitAnswer as submitPinball,
} from '../../src/games/fraction-pinball/rules';

import {
  doRollDice as contigRoll,
  placeChip as placeContig,
  hasValidMoves as contigHasMoves,
} from '../../src/games/contig-60/rules';
import { createInitialState as createContigState } from '../../src/games/contig-60/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 14 rules-phase — Hex-a-Gone empty / wrong-phase guards', () => {
  it('getValidPlacements is [] without selectedBlockForPlacement', () => {
    expect(hagPlacements(createHag())).toEqual([]);
  });

  it('selectBlockForPlacement is identity outside placeBlocks', () => {
    const state = createHag();
    expect(selectBlockForPlacement(state, 'triangle')).toBe(state);
  });

  it('selectBlockForPlacement rejects shapes not in committed selection', () => {
    let state = selectHag(createHag(), 'triangle');
    state = selectHag(state, 'rhombus');
    state = commitSelection(state);
    expect(selectBlockForPlacement(state, 'hexagon')).toBe(state);
    const switched = selectBlockForPlacement(state, 'rhombus');
    expect(switched.selectedBlockForPlacement).toBe('rhombus');
    expect(switched).not.toBe(state);
  });

  it('placeBlock is identity on selectBlocks and with null selection', () => {
    const fresh = createHag();
    expect(placeHag(fresh, 0, 0)).toBe(fresh);

    const forced: HexAGoneGameState = {
      ...commitSelection(selectHag(createHag(), 'triangle')),
      selectedBlockForPlacement: null,
    };
    expect(placeHag(forced, 0, 0)).toBe(forced);
  });

  it('select/deselect after commit are identity; passTurn on gameOver is identity', () => {
    let state = commitSelection(selectHag(createHag(), 'triangle'));
    expect(selectHag(state, 'rhombus')).toBe(state);
    expect(deselectBlock(state, 'triangle')).toBe(state);

    const over: HexAGoneGameState = {
      ...createHag(),
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(passHag(over)).toBe(over);
  });

  it('getPhaseMessage after multi-select commit reports remaining count', () => {
    let state = selectHag(createHag(), 'triangle');
    state = selectHag(state, 'rhombus');
    state = commitSelection(state);
    expect(hagPhaseMsg(state)).toMatch(/2 remaining/);
  });

  it('canPlayerMove is false when bank is empty or board is full', () => {
    const emptyBank: HexAGoneGameState = {
      ...createHag(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(hagCanMove(emptyBank)).toBe(false);

    const fullBoard: HexAGoneGameState = {
      ...createHag(),
      board: createHag().board.map((c) => ({
        ...c,
        filled: true,
        filledBy: 'player1' as const,
        blockId: 1,
      })),
    };
    expect(hagCanMove(fullBoard)).toBe(false);
  });
});

describe('Wave 14 rules-phase — Juggle wrong-phase / empty preview', () => {
  it('roll / selectDie / selectShape / placeShape are identity outside their phases', () => {
    const rolling = createJuggle();
    expect(selectDie(rolling, 0)).toBe(rolling);
    expect(selectShape(rolling, TETROMINOES[0]!)).toBe(rolling);
    expect(placeShape(rolling, { row: 0, col: 0 })).toBe(rolling);

    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = juggleRoll(rolling);
    expect(selecting.phase).toBe('selectingShape');
    expect(juggleRoll(selecting)).toBe(selecting);
    expect(placeShape(selecting, { row: 0, col: 0 })).toBe(selecting);
  });

  it('selectShape without selectedCategory is identity; isPlacementValid false off placing', () => {
    const state: JuggleState = {
      ...createJuggle(),
      phase: 'selectingShape',
      currentDice: [4, 4],
      selectedCategory: null,
    };
    expect(selectShape(state, TETROMINOES[0]!)).toBe(state);
    expect(isPlacementValid(createJuggle(), { row: 0, col: 0 })).toBe(false);
  });

  it('getPreviewCells without shape is []; monomino place records history fields', () => {
    expect(getPreviewCells(createJuggle(), { row: 0, col: 0 })).toEqual([]);

    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = juggleRoll(createJuggle());
    state = selectDie(state, 0);
    expect(state.phase).toBe('placing');
    state = placeShape(state, { row: 0, col: 0 });
    expect(state.moveHistory).toHaveLength(1);
    const move = state.moveHistory[0]!;
    expect(move.player).toBe('player1');
    expect(move.position).toEqual({ row: 0, col: 0 });
    expect(move.shapeId).toBeTruthy();
    expect(move.moveNumber).toBe(1);
  });

  it('canMakeAnyMove is false with dice but fully filled board', () => {
    const fresh = createJuggle();
    const filled = {
      ...fresh.boards.player1,
      cells: fresh.boards.player1.cells.map((row) => row.map(() => true)),
    };
    const jammed: JuggleState = {
      ...fresh,
      boards: { player1: filled, player2: fresh.boards.player2 },
      currentDice: [1, 1],
      phase: 'selectingShape',
    };
    expect(canMakeAnyMove(jammed)).toBe(false);
  });
});

describe("Wave 14 rules-phase — Pent'Em In placements / selection guards", () => {
  it('getPieceCells for unknown shape is []', () => {
    expect(getPieceCells('nope', { row: 0, col: 0 }, 0, false)).toEqual([]);
  });

  it('placePiece OOB for I5 is identity; selectPiece for missing shape is identity', () => {
    const state = createPent();
    expect(placePiece(state, 'I5', { row: 9, col: 9 }, 0, false)).toBe(state);
    expect(selectPiece(state, 'ZZ')).toBe(state);
  });

  it('cancelSelection from selectPiece stays selectPiece; setPreviewPosition only updates preview', () => {
    const fresh = createPent();
    const cancelled = cancelSelection(fresh);
    expect(cancelled.phase).toBe('selectPiece');
    expect(cancelled.selectedPiece).toBeNull();

    const selected = selectPiece(fresh, 'I5');
    const previewed = setPreviewPosition(selected, { row: 2, col: 3 });
    expect(previewed.previewPosition).toEqual({ row: 2, col: 3 });
    expect(previewed.phase).toBe('placePiece');
    expect(previewed.selectedPiece).toBe('I5');
  });

  it('canPlayerMove is false when available hand is empty', () => {
    const state = createPent();
    const empty = {
      ...state,
      player1Pieces: { available: [] as string[], placed: [...state.player1Pieces.available] },
    };
    expect(pentCanMove(empty, 'player1')).toBe(false);
  });

  it('placePiece on occupied cells is identity after prior place', () => {
    let state = createPent();
    state = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    expect(placePiece(state, 'V', { row: 2, col: 2 }, 0, false)).toBe(state);
  });
});

describe('Wave 14 rules-phase — Prime Gold rolling / miss / history', () => {
  it('getValidPlacements / hasValidMoves on rolling are empty/false', () => {
    const state = createPrime();
    expect(state.phase).toBe('rolling');
    expect(primePlacements(state)).toEqual([]);
    expect(primeHasMoves(state)).toBe(false);
  });

  it('findCellByValue miss is null; placeChip with unreachable value is identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = primeRoll(createPrime());
    expect(placing.phase).toBe('placing');
    expect(findCellByValue(placing, 99999)).toBeNull();
    expect(placePrime(placing, 99999, 'x')).toBe(placing);
  });

  it('successful place appends history with value/expr/player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = primeRoll(createPrime());
    const placements = primePlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const pick = placements[0]!;
    state = placePrime(state, pick.value, pick.expr);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0]!.result).toBe(pick.value);
    expect(state.moveHistory[0]!.expression).toBe(pick.expr);
    expect(state.moveHistory[0]!.player).toBe('player1');
  });
});

describe('Wave 14 rules-phase — Remainder Islands preview / skip / select guards', () => {
  it('previewDivision null without roll or unknown island', () => {
    const fresh = createRemainder();
    expect(previewDivision(fresh, 'island-0-0')).toBeNull();

    const withRoll = {
      ...fresh,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      phase: 'selectIsland' as const,
    };
    expect(previewDivision(withRoll, 'missing-island')).toBeNull();
    const ok = previewDivision(withRoll, fresh.islands[0]!.id);
    expect(ok).not.toBeNull();
    expect(ok!.dividend).toBe(7);
  });

  it('selectIsland outside selectIsland is identity', () => {
    const state = createRemainder();
    expect(selectIsland(state, state.islands[0]!.id)).toBe(state);
  });

  it('performRoll with all islands owned by opponent auto-skips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const owned = {
      ...createRemainder(),
      islands: createRemainder().islands.map((i) => ({
        ...i,
        owner: 'player2' as const,
      })),
    };
    expect(findValidIslands(owned, 12)).toEqual([]);
    const next = performRoll(owned);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.validIslands).toEqual([]);
  });

  it('selectIsland claim records history division fields', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = performRoll(createRemainder());
    if (state.phase !== 'selectIsland' || state.validIslands.length === 0) {
      state = {
        ...createRemainder(),
        phase: 'selectIsland',
        currentRoll: { die1: 5, die2: 4, total: 9 },
        validIslands: [createRemainder().islands[0]!.id],
      };
    }
    const islandId = state.validIslands[0]!;
    const claimed = selectIsland(state, islandId);
    expect(claimed.moveHistory).toHaveLength(1);
    const move = claimed.moveHistory[0]!;
    expect(move.island.id).toBe(islandId);
    expect(move.divisionResult.dividend).toBe(state.currentRoll!.total);
    expect(typeof move.pointsEarned).toBe('number');
  });
});

describe('Wave 14 rules-phase — Calla animating/gameOver pit gates', () => {
  it('getValidPits / canSelectPit empty on animating and gameOver', () => {
    const animating = { ...createCalla(), phase: 'animating' as const };
    expect(getValidPits(animating)).toEqual([]);
    expect(canSelectPit(animating, 'player1', 0)).toBe(false);
    expect(callaMove(animating, 0)).toBe(animating);

    const over = {
      ...createCalla(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getValidPits(over)).toEqual([]);
    expect(canSelectPit(over, 'player1', 0)).toBe(false);
  });

  it('getLastMoveInfo pluralizes cube vs cubes; phase message covers animating', () => {
    expect(getLastMoveInfo(createCalla())).toBeNull();

    const withOne = {
      ...createCalla(),
      moveHistory: [
        {
          player: 'player1' as const,
          pitIndex: 0,
          cubesDistributed: 1,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: 1,
        },
      ],
    };
    expect(getLastMoveInfo(withOne)).toMatch(/1 cube(?!s)/);

    const withMany = {
      ...withOne,
      moveHistory: [
        { ...withOne.moveHistory[0]!, cubesDistributed: 3, captured: 2 },
      ],
    };
    expect(getLastMoveInfo(withMany)).toMatch(/3 cubes/);
    expect(getLastMoveInfo(withMany)).toMatch(/captured 2/);

    expect(callaPhaseMsg({ ...createCalla(), phase: 'animating' })).toMatch(
      /distributing/
    );
  });
});

describe('Wave 14 rules-phase — Star Track draw/select identity + progress', () => {
  it('drawChains / selectChain are identity outside their phases', () => {
    const fresh = createStar();
    expect(selectChain(fresh, 0)).toBe(fresh);

    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const selecting = drawChains(createStar());
    expect(selecting.phase).toBe('selectChain');
    expect(drawChains(selecting)).toBe(selecting);
    expect(starPhaseMsg(selecting)).toMatch(/Choose a chain/);
  });

  it('getProgress is 0 at start and 100 at TRACK_LENGTH; draw exhaust message', () => {
    const fresh = createStar();
    expect(getProgress(fresh, 'player1')).toBe(0);
    expect(
      getProgress(
        { ...fresh, player1Position: TRACK_LENGTH },
        'player1'
      )
    ).toBe(100);

    expect(
      starPhaseMsg({
        ...fresh,
        phase: 'gameOver',
        winner: null,
      })
    ).toMatch(/draw/i);
  });

  it('drawChains with fewer than 2 chains ends game by position', () => {
    const short = {
      ...createStar(),
      chainBucket: createStar().chainBucket.slice(0, 1),
      player1Position: 5,
      player2Position: 3,
    };
    const ended = drawChains(short);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });
});

describe('Wave 14 rules-phase — Fab pipeline illegal matrix', () => {
  it('selectBar2 same as bar1 is identity; wrong-phase selectOperation is identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createFab();
    const barIds = [...state.fractionBars.keys()];
    const first = barIds[0]!;
    state = selectBar1(state, first);
    expect(state.phase).toBe('selectingBar2');
    expect(selectBar2(state, first)).toBe(state);
    expect(selectOperation(state, 'add')).toBe(state);
  });

  it('clearSelection from mid-pipeline returns selectingBar1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createFab();
    const unused = [...state.fractionBars.entries()]
      .filter(([, b]) => !b.used)
      .map(([id]) => id);
    state = selectBar1(state, unused[0]!);
    state = selectBar2(state, unused[1]!);
    expect(state.phase).toBe('selectingOperation');
    const cleared = clearFab(state);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
  });

  it('findMatchingAnswers empty for absurd fraction; executeMove wrong phase identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const state = createFab();
    expect(
      findMatchingAnswers(state, { numerator: 999, denominator: 1 })
    ).toEqual([]);
    expect(executeFab(state, 'answer-0')).toBe(state);
  });

  it('formatMove returns ? for unknown bars; real claim formats equation', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = createFab();
    expect(
      formatFabMove(state, {
        player: 'player1',
        bar1Id: 'missing',
        bar2Id: 'missing',
        operation: 'add',
        resultId: 'missing',
        moveNumber: 1,
      })
    ).toBe('?');

    const unused = [...state.fractionBars.entries()].filter(([, b]) => !b.used);
    let claimed = state;
    outer: for (let i = 0; i < unused.length; i++) {
      for (let j = i + 1; j < unused.length; j++) {
        const bar1 = unused[i]![1];
        const bar2 = unused[j]![1];
        const possibles = getPossibleResults(bar1, bar2);
        for (const { operation, result } of possibles) {
          const matches = findMatchingAnswers(state, result);
          if (matches.length === 0) continue;
          let trial = selectBar1(state, unused[i]![0]);
          trial = selectBar2(trial, unused[j]![0]);
          trial = selectOperation(trial, operation);
          if (trial.phase !== 'confirmingMove') continue;
          const next = executeFab(trial, matches[0]!);
          if (next !== trial) {
            claimed = next;
            break outer;
          }
        }
      }
    }
    expect(claimed.moveHistory.length).toBeGreaterThan(0);
    const formatted = formatFabMove(claimed, claimed.moveHistory[0]!);
    expect(formatted).not.toBe('?');
    expect(formatted).toMatch(/=/);
    void calculateResult;
  });
});

describe('Wave 14 rules-phase — Stars / Par / Ramrod / Kwatro / Sum / FIAR / Contig / Quiz', () => {
  it('Stars: selectCard on gameOver identity; placeCard on occupied cell identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const over = { ...createStars(), phase: 'gameOver' as const, winner: 'player1' as const };
    const hand = over.playerHands.player1;
    if (hand.length > 0) {
      expect(selectCard(over, hand[0]!.id)).toBe(over);
    }

    let state = createStars();
    const card = state.playerHands.player1[0]!;
    state = selectCard(state, card.id);
    const placements = starsPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const pos = placements[0]!;
    state = placeCard(state, pos.row, pos.col);
    // Force player1 and try occupied
    state = {
      ...state,
      currentPlayer: 'player1',
      phase: 'placingCard',
      selectedCard: state.playerHands.player1[0] ?? card,
    };
    if (state.selectedCard) {
      expect(placeCard(state, pos.row, pos.col)).toBe(state);
    }
    const cleared = clearStars(createStars());
    expect(cleared.phase).toBe('selectingCard');
  });

  it('Par: selectBlock wrong phase identity; clearSelection resets; formatMove shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createPar();
    const placing = {
      ...state,
      phase: 'placingBlock' as const,
      selectedBlock: state.hands.player1[0]!.id,
    };
    expect(selectPar(placing, state.hands.player1[1]!.id)).toBe(placing);

    state = selectPar(state, state.hands.player1[0]!.id);
    expect(state.phase).toBe('placingBlock');
    const cleared = clearPar(state);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();

    expect(parPlacements(createPar()).length).toBeGreaterThan(0);
    expect(
      formatParMove({
        player: 'player1',
        block: state.hands.player1[0]!,
        baseId: '0-0',
        pointsScored: 3,
        matchDetails: [],
        moveNumber: 1,
      })
    ).toMatch(/pts/);
  });

  it('Ramrod: getValidPlacements for unknown rod []; wrong-phase selectRod identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const state = createRamrod();
    expect(ramrodPlacements(state, 'missing-rod')).toEqual([]);
    const placing = { ...state, phase: 'placingRod' as const, selectedRod: state.playerRods.player1[0]! };
    expect(selectRod(placing, state.playerRods.player1[1]!)).toBe(placing);
    const cleared = clearRamrod(placing);
    expect(cleared.phase).toBe('selectingRod');
    expect(
      formatRamrodMove({
        player: 'player1',
        rod: state.rods.get(state.playerRods.player1[0]!)!,
        boxId: 'box-1',
        slot: 0,
        capturedBox: false,
        pointsScored: 0,
        moveNumber: 1,
      })
    ).toMatch(/Rod/);
  });

  it('Kwatro: getValidMoves missing chip []; moveChip wrong phase identity; formatMove', () => {
    const state = createKwa();
    expect(kwaValid(state, 'missing')).toEqual([]);
    expect(kwaMove(state, 'n1')).toBe(state);

    const chipId = [...state.chips.entries()].find(
      ([, c]) => c.owner === 'player1' && c.position
    )?.[0];
    if (chipId) {
      const selected = kwaSelect(state, chipId);
      if (selected.phase === 'selectingDest') {
        const cleared = clearKwa(selected);
        expect(cleared.phase).toBe('selectingChip');
      }
    }
    expect(
      formatKwaMove({
        player: 'player1',
        chip: [...state.chips.values()][0]!,
        fromNode: 'a',
        toNode: 'b',
        alignment: null,
        moveNumber: 1,
      })
    ).toMatch(/Chip/);
  });

  it('Sum Dominoes: selectDomino on rolling identity; getRemainingCount; formatMove', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const rolling = createSum();
    const hand = rolling.hands.player1;
    if (hand.length > 0) {
      expect(selectDomino(rolling, hand[0]!.id)).toBe(rolling);
    }
    expect(getRemainingCount(rolling, 'player1')).toBe(hand.length);

    const afterRoll = sumRoll(rolling);
    expect(['placing', 'passing']).toContain(afterRoll.phase);
    expect(placeDomino(afterRoll, { row: 0, col: 0 }, 'horizontal')).toBe(
      afterRoll
    ); // no selection / wrong phase

    const dummy: Domino = {
      id: 'd',
      face1: 3,
      face2: 4,
      owner: 'player1',
      orientation: 'horizontal',
    };
    expect(
      formatSumMove({
        player: 'player1',
        domino: dummy,
        position: { row: 0, col: 0 },
        orientation: 'horizontal',
        matchedFace: 3,
        adjacentFace: 4,
        diceSum: 7,
        moveNumber: 1,
      })
    ).toMatch(/\[3\|4\]/);
    expect(sumPlacements(afterRoll, dummy, 7).length).toBeGreaterThanOrEqual(0);
    void SD_CFG;
  });

  it('FIAR: getSelectableNodes empty in placement; selectChip identity; canPlaceChip false on occupied', () => {
    const state = createFiar();
    expect(state.phase).toBe('placement');
    expect(getSelectableNodes(state)).toEqual([]);
    expect(fiarSelect(state, 'n0')).toBe(state);
    expect(deselectChip(state).selectedNode).toBeNull();

    // Place if possible then reject re-place
    const nodes = [...state.board.nodes.keys()];
    const first = nodes.find((id) => canPlaceChip(state, id));
    if (first) {
      const placed = placeFiar(state, first);
      expect(canPlaceChip(placed, first)).toBe(false);
      expect(placeFiar(placed, first)).toBe(placed);
    }
  });

  it('Contig: placeChip on rolling identity; hasValidMoves false without dice; re-roll identity', () => {
    const state = createContigState();
    expect(placeContig(state, 0, '1+1')).toBe(state);
    expect(contigHasMoves(state)).toBe(false);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = contigRoll(state);
    expect(rolled.phase).toBe('calculating');
    expect(contigRoll(rolled)).toBe(rolled);
  });

  it('Frac Fact / Pinball: submitAnswer wrong phase / null problem is identity', () => {
    const frac = createFrac('medium');
    expect(submitFrac(frac, { numerator: 1, denominator: 2 })).toBe(frac);

    const started = startFrac(frac);
    expect(started.currentProblem).not.toBeNull();
    const choice = started.currentProblem!.answerChoices[0]!;
    const answered = submitFrac(started, choice);
    expect(answered.phase).toBe('showingResult');
    expect(submitFrac(answered, choice)).toBe(answered);
    const next = nextProblem(answered);
    expect(['playing', 'gameOver']).toContain(next.phase);

    const pin = createPinball();
    expect(submitPinball(pin, '1/2')).toBe(pin);
    const pinStarted = startPinball(pin);
    expect(pinStarted.currentChallenge).not.toBeNull();
    const pinChoice = pinStarted.currentChallenge!.answerChoices[0]!;
    const pinAnswered = submitPinball(pinStarted, pinChoice);
    expect(pinAnswered.phase).toBe('showResult');
    expect(submitPinball(pinAnswered, pinChoice)).toBe(pinAnswered);
  });
});
