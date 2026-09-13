import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';
import {
  calculatePoints,
  placeChip as placeContig,
  doRollDice as contigRoll,
  checkWinner as contigWinner,
} from '../../src/games/contig-60/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  calculateDivision,
  selectIsland,
  previewDivision,
  performRoll,
  findValidIslands,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  placeBlock as placePar,
  calculateScore,
  getValidPlacements as getParPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { countDifferences } from '../../src/games/stars-bars/types';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getBoxSum,
  getRemainingValue,
  getValidPlacements as getRamrodPlacements,
} from '../../src/games/ramrod/rules';
import type { SumBox, Rod } from '../../src/games/ramrod/types';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  placeChip as placePrime,
  getValidPlacements as getPrimePlacements,
} from '../../src/games/prime-gold/rules';

import {
  createInitialState as createHexAGone,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  placeBlock as placeHag,
  getPhaseMessage as hagPhaseMsg,
  canPlaceAt,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
  getBoardFillPercentage,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  passTurn as passSum,
  getRemainingCount,
  getValidPlacements as getSumPlacements,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getLastMoveInfo,
  canSelectPit,
  getValidPits,
} from '../../src/games/calla/rules';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as placeFiar,
  selectChip,
  deselectChip,
  getSelectableNodes,
} from '../../src/games/fiar/rules';

import {
  createInitialGameState as createKings,
  selectKing,
  moveKing,
  placeQuadraphage,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';
import { canCompleteTurn } from '../../src/games/kings-quadraphages/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 12 — Contig scoring + roll phase', () => {
  it('calculatePoints is 0 on an empty neighborhood', () => {
    const state = createContig();
    const empty = [...state.cells.values()].find((c) => c.owner === null)!;
    expect(calculatePoints(state, empty.value)).toBe(0);
  });

  it('calculatePoints counts each owned adjacent cell', () => {
    let state = createContig();
    const target = [...state.cells.values()].find((c) => {
      return getAdjacentPositions(c.row, c.col).length >= 2;
    })!;
    const adj = getAdjacentPositions(target.row, target.col);
    const cells = new Map(state.cells);
    let owned = 0;
    for (const { row, col } of adj) {
      const v = state.grid[row][col];
      if (v === null) continue;
      cells.set(v, { ...cells.get(v)!, owner: 'player2' });
      owned++;
      if (owned >= 2) break;
    }
    state = { ...state, cells };
    expect(calculatePoints(state, target.value)).toBe(owned);
  });

  it('placeChip awards adjacency points and flips seat to rolling', () => {
    let state = createContig();
    const target = [...state.cells.values()].find((c) => c.owner === null)!;
    const adj = getAdjacentPositions(target.row, target.col);
    const cells = new Map(state.cells);
    for (const { row, col } of adj.slice(0, 1)) {
      const v = state.grid[row][col];
      if (v === null) continue;
      cells.set(v, { ...cells.get(v)!, owner: 'player1' });
    }
    const expected = calculatePoints({ ...state, cells }, target.value);
    state = {
      ...state,
      cells,
      phase: 'calculating',
      currentDice: [1, 1, 1],
    };
    const next = placeContig(state, target.value, '1+1-1');
    expect(next.scores.player1).toBe(expected);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory.at(-1)?.points).toBe(expected);
  });

  it('full-board points branch: higher score wins when board marked', () => {
    let state = createContig();
    const cells = new Map(state.cells);
    let i = 0;
    for (const [k, cell] of cells) {
      cells.set(k, {
        ...cell,
        owner: i % 2 === 0 ? 'player1' : 'player2',
      });
      i++;
    }
    state = {
      ...state,
      cells,
      scores: { player1: 12, player2: 5 },
    };
    expect(contigWinner(state)).toBe('player1');
  });

  it('doRollDice with mocked dice enters calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = contigRoll(createContig());
    expect(next.phase).toBe('calculating');
    expect(next.currentDice).toEqual([1, 1, 1]);
  });
});

describe('Wave 12 — Remainder scoring + roll phase', () => {
  it('calculateDivision returns quotient and remainder', () => {
    expect(calculateDivision(17, 5)).toEqual({
      dividend: 17,
      divisor: 5,
      quotient: 3,
      remainder: 2,
    });
    expect(calculateDivision(12, 4).remainder).toBe(0);
  });

  it('selectIsland adds remainder points and depletes a chip', () => {
    let state = createRemainder();
    state = {
      ...state,
      phase: 'selectIsland',
      currentRoll: { die1: 5, die2: 6, total: 11 },
      validIslands: state.islands.map((i) => i.id),
    };
    const island = state.islands.find((i) => i.value === 5)!;
    const before = state.player1Score;
    const next = selectIsland(state, island.id);
    expect(next.player1Score).toBe(before + (11 % 5));
    expect(next.player1Chips).toBe(state.player1Chips - 1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(countOwnedIslands(next).player1).toBe(1);
  });

  it('previewDivision mirrors calculateDivision for current roll', () => {
    let state = createRemainder();
    const island = state.islands[0]!;
    state = {
      ...state,
      currentRoll: { die1: 4, die2: 3, total: 7 },
    };
    expect(previewDivision(state, island.id)).toEqual(
      calculateDivision(7, island.value)
    );
    expect(
      previewDivision({ ...state, currentRoll: null }, island.id)
    ).toBeNull();
  });

  it('performRoll with no valid islands auto-skips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createRemainder();
    state = {
      ...state,
      islands: state.islands.map((i) => ({ ...i, owner: 'player2' as const })),
    };
    const next = performRoll(state);
    expect(next.validIslands).toEqual([]);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
  });

  it('findValidIslands excludes opponent-owned islands', () => {
    let state = createRemainder();
    const first = state.islands[0]!;
    state = {
      ...state,
      islands: state.islands.map((i) =>
        i.id === first.id ? { ...i, owner: 'player2' as const } : i
      ),
    };
    const valid = findValidIslands(state, 7);
    expect(valid).not.toContain(first.id);
    expect(valid.length).toBe(state.islands.length - 1);
  });
});

describe('Wave 12 — Par 55 attribute match scoring', () => {
  it('calculateScore matchDetails points sum to totalPoints', () => {
    let state = createPar();
    const block = state.hands.player1[0]!;
    state = selectPar(state, block.id);
    const baseId = [...state.bases.keys()][0]!;
    const base = state.bases.get(baseId)!;
    if (base.adjacentBases.length === 0) {
      const { totalPoints, matchDetails } = calculateScore(
        state,
        block,
        baseId
      );
      expect(totalPoints).toBe(0);
      expect(matchDetails).toEqual([]);
      return;
    }
    const adjId = base.adjacentBases[0]!;
    const twin = { ...block, id: 'seed-twin' };
    const bases = new Map(state.bases);
    bases.set(adjId, {
      ...bases.get(adjId)!,
      block: twin,
      placedBy: 'player2',
    });
    state = { ...state, bases };
    const { totalPoints, matchDetails } = calculateScore(state, block, baseId);
    const detailPts = matchDetails.reduce((s, d) => s + d.points, 0);
    expect(totalPoints).toBe(detailPts);
    expect(totalPoints).toBeGreaterThan(0);
  });

  it('placeBlock records score then advances seat', () => {
    let state = createPar();
    const block = state.hands.player1[0]!;
    state = selectPar(state, block.id);
    const placements = getParPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const next = placePar(state, placements[0]!);
    expect(next.phase === 'selectingBlock' || next.phase === 'gameOver').toBe(
      true
    );
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Wave 12 — Stars & Bars star doubling via placeCard', () => {
  it('first card scores 0; adjacent star placement doubles diffs', () => {
    let state = createStars();
    const cardA = state.playerHands.player1[0]!;
    state = selectCard(state, cardA.id);
    state = placeCard(state, 1, 1);
    expect(state.moveHistory[0]?.score).toBe(0);
    expect(state.moveHistory[0]?.breakdown).toMatch(/first card/i);

    const cardB = state.playerHands.player2[0]!;
    state = selectCard(state, cardB.id);
    const diffs = countDifferences(cardB, cardA);
    state = placeCard(state, 0, 0);
    const last = state.moveHistory.at(-1)!;
    expect(last.breakdown).toMatch(/star/i);
    expect(last.score).toBe(diffs * 2);
    expect(state.playerScores.player2).toBe(diffs * 2);
  });
});

describe('Wave 12 — Ramrod box sum / remaining + place chain', () => {
  it('getBoxSum and getRemainingValue cover empty / half / full boxes', () => {
    const rodA: Rod = {
      id: 'a',
      length: 3,
      color: 'red',
      owner: 'player1',
      position: { boxId: 'b', slot: 0 },
    };
    const rodB: Rod = {
      id: 'b',
      length: 4,
      color: 'pink',
      owner: 'player1',
      position: { boxId: 'b', slot: 1 },
    };
    const empty: SumBox = {
      id: 'b',
      targetSum: 7,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    expect(getBoxSum(empty)).toBeNull();
    expect(getRemainingValue(empty)).toBe(7);

    const half: SumBox = { ...empty, rods: [rodA, null] };
    expect(getBoxSum(half)).toBeNull();
    expect(getRemainingValue(half)).toBe(4);

    const halfOther: SumBox = { ...empty, rods: [null, rodB] };
    expect(getRemainingValue(halfOther)).toBe(3);

    const full: SumBox = { ...empty, rods: [rodA, rodB] };
    expect(getBoxSum(full)).toBe(7);
    expect(getRemainingValue(full)).toBe(7);
  });

  it('selectRod → placeRod advances phase and records move', () => {
    let state = createRamrod();
    const rodId = state.playerRods.player1[0]!;
    state = selectRod(state, rodId);
    expect(state.phase).toBe('placingRod');
    const spots = getRamrodPlacements(state, rodId);
    expect(spots.length).toBeGreaterThan(0);
    const { boxId, slot } = spots[0]!;
    const next = placeRod(state, boxId, slot);
    expect(next.phase === 'selectingRod' || next.phase === 'gameOver').toBe(
      true
    );
    expect(next.moveHistory.length).toBe(1);
    const box = next.boxes.get(boxId)!;
    if (box.rods[0] && !box.rods[1]) {
      expect(getRemainingValue(box)).toBe(box.targetSum - box.rods[0]!.length);
    }
  });
});

describe('Wave 12 — Prime Gold roll → place updates veins', () => {
  it('mocked roll then placeChip updates chips and veins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createPrime();
    state = primeRoll(state);
    expect(state.phase).toBe('placing');
    expect(state.diceRoll).toBeTruthy();
    const hits = getPrimePlacements(state);
    if (hits.length === 0) {
      expect(state.phase).toBe('placing');
      return;
    }
    const hit = hits[0]!;
    const next = placePrime(state, hit.value, hit.expr);
    expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(0);
    expect(next.playerChips.player1).toBe(state.playerChips.player1 - 1);
  });
});

describe('Wave 12 — Hex-a-Gone select→commit→place seat flip', () => {
  it('full turn chain returns to selectBlocks for opponent', () => {
    let state = createHexAGone();
    const shape = getAvailableShapes(state)[0]!;
    state = selectHag(state, shape);
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(hagPhaseMsg(state).length).toBeGreaterThan(0);
    const cell = state.board.find((c) => canPlaceAt(state, c.q, c.r))!;
    const next = placeHag(state, cell.q, cell.r);
    expect(next.phase).toBe('selectBlocks');
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnSelection.committed).toBe(false);
  });
});

describe('Wave 12 — Juggle roll→die→shape→place fill %', () => {
  it('placeShape increases board fill percentage', () => {
    // random 0 → die faces 1 → monomino (easy to place)
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createJuggle();
    state = juggleRoll(state);
    expect(state.currentDice).toEqual([1, 1]);
    state = selectDie(state, 0);
    const die = state.currentDice![0]!;
    const shapes = getShapesForDie(die);
    expect(shapes.length).toBeGreaterThan(0);
    if (state.phase === 'selectingShape') {
      state = selectShape(state, shapes[0]!);
    }
    expect(state.phase).toBe('placing');
    const before = getBoardFillPercentage(state.boards.player1);
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    state = placeShape(state, { row: 0, col: 0 });
    expect(getBoardFillPercentage(state.boards.player1)).toBeGreaterThan(
      before
    );
  });
});
describe('Wave 12 — Sum Dominoes roll / pass / remaining', () => {
  it('doRollDice enters placing or passing; place or pass advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createSum();
    const remainingBefore = getRemainingCount(state, 'player1');
    expect(remainingBefore).toBe(7);
    state = sumRoll(state);
    expect(['placing', 'passing']).toContain(state.phase);
    if (state.phase === 'passing') {
      const next = passSum(state);
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('rolling');
      return;
    }
    const sum = getDiceSum(state.currentDice!);
    const domino = state.hands.player1.find(
      (d) => getSumPlacements(state, d, sum).length > 0
    );
    if (!domino) {
      expect(state.phase).toBe('placing');
      return;
    }
    state = selectDomino(state, domino.id);
    const spots = getSumPlacements(state, domino, sum);
    const spot = spots[0]!;
    const next = placeDomino(state, spot.position, spot.orientation);
    expect(next.moveHistory.length).toBe(1);
    expect(getRemainingCount(next, 'player1')).toBe(remainingBefore - 1);
  });
});

describe('Wave 12 — Calla free-turn keeps seat', () => {
  it('sowing last cube into calla grants free turn', () => {
    let state = createCalla();
    state = {
      ...state,
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [1, 1, 1, 1, 1],
    };
    expect(canSelectPit(state, 'player1', 4)).toBe(true);
    expect(getValidPits(state)).toContain(4);
    const next = callaMove(state, 4);
    const last = next.moveHistory.at(-1)!;
    expect(last.gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
    expect(getLastMoveInfo(next)).toMatch(/Free turn/i);
  });
});

describe('Wave 12 — FIAR placement→movement select/deselect', () => {
  it('after all chips placed, selectChip / deselectChip clear selection', () => {
    let state = createFiar();
    const nodeIds = [...state.board.nodes.keys()];
    let i = 0;
    while (
      state.chipsPlaced.player1 + state.chipsPlaced.player2 <
      FIAR_CFG.CHIPS_PER_PLAYER * 2
    ) {
      const id = nodeIds[i++]!;
      if (state.board.nodes.get(id)?.chip === null) {
        state = placeFiar(state, id);
      }
    }
    expect(state.phase).toBe('movement');
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    state = selectChip(state, selectable[0]!);
    expect(state.selectedNode).toBe(selectable[0]);
    state = deselectChip(state);
    expect(state.selectedNode).toBeNull();
  });
});

describe('Wave 12 — Kings select→move→place seat flip', () => {
  it('full turn flips player and restores moveKing phase', () => {
    let state = createKings();
    expect(getCurrentPhaseMessage(state)).toMatch(/King/i);
    expect(canCompleteTurn(state, 'player1')).toBe(true);
    state = selectKing(state);
    expect(state.selectedKingPosition).toBeTruthy();
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    expect(state.turnPhase).toBe('moveKing');
    expect(state.player1Supply).toBe(29);
  });
});
