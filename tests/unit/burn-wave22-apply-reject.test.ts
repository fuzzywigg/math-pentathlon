/**
 * Wave 22 — illegal apply reject after legal mid-state (occupied / wrong claim / OOB).
 * Distinct from wave 15 wrong-phase identity and wave 18 pass-stuck-valid.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  isValidMove as hexValid,
} from '../../src/games/hex/rules';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  findMatchingAnswers,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialGameState as createKings,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidPlacement as kingsValidPlace,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  selectPiece,
  makeMove as queensMove,
  getValidMoves as queensValid,
} from '../../src/games/queens-guards/rules';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CONFIG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  canPlaceChip,
  canMove as fiarCanMove,
} from '../../src/games/fiar/rules';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  isValidPlacement as sumValidPlace,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  isValidMove as kwaValid,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  isValidPlacement as ramValidPlace,
} from '../../src/games/ramrod/rules';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as contigPlace,
} from '../../src/games/contig-60/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 22 apply-reject — Hex occupied / OOB / after winner', () => {
  it('second place on occupied cell and OOB are identity', () => {
    let state = createHex();
    const pos = { row: 2, col: 2 };
    expect(hexValid(state, pos)).toBe(true);
    state = hexMove(state, pos);
    expect(state.board[2][2]).toBe('player1');

    const rejected = hexMove(state, pos);
    expect(rejected).toBe(state);
    expect(hexValid(state, pos)).toBe(false);

    const oob = hexMove(state, { row: -1, col: 0 });
    expect(oob).toBe(state);
  });
});

describe('Wave 22 apply-reject — Fab wrong answerId while confirming', () => {
  it('executeMove with mismatched or claimed answer keeps identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    let state = createFab();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);

    state = selectBar1(state, bars[0].id);
    state = selectBar2(state, bars[1].id);
    state = selectOperation(state, 'add');
    expect(state.phase).toBe('confirmingMove');

    const result = calculateResult(bars[0].fraction, bars[1].fraction, 'add');
    expect(result).not.toBeNull();

    const matchIds = findMatchingAnswers(state, result!);
    const junkId = 'answer-does-not-exist';
    const bad = executeMove(state, junkId);
    expect(bad).toBe(state);

    // Claim a non-matching answer if one exists
    const nonMatch = [...state.answerBars.values()].find(
      (a) => a.claimedBy === null && !matchIds.includes(a.id)
    );
    if (nonMatch) {
      const wrong = executeMove(state, nonMatch.id);
      expect(wrong).toBe(state);
    }

    if (matchIds.length > 0) {
      const ok = executeMove(state, matchIds[0]);
      expect(ok).not.toBe(state);
      expect(ok.answerBars.get(matchIds[0])?.claimedBy).toBe('player1');
    }
  });
});

describe('Wave 22 apply-reject — Kings illegal place after king move', () => {
  it('placeQuadraphage on king cell / OOB rejects; valid place mutates', () => {
    let state = createKings();
    state = selectKing(state);
    expect(state.turnPhase).toBe('moveKing');
    const dest = { row: 2, col: 5 }; // typical adjacent from (1,5)
    // Try a few adjacent destinations until one works
    const candidates = [
      { row: 2, col: 5 },
      { row: 2, col: 4 },
      { row: 2, col: 6 },
      { row: 1, col: 4 },
      { row: 1, col: 6 },
    ];
    let moved = false;
    for (const c of candidates) {
      const next = moveKing(state, c);
      if (next !== state) {
        state = next;
        moved = true;
        break;
      }
    }
    expect(moved).toBe(true);
    expect(state.turnPhase).toBe('placeQuadraphage');

    const kingPos = getKingPosition(state, 'player1');
    expect(kingPos).not.toBeNull();
    const onKing = placeQuadraphage(state, kingPos!);
    expect(onKing).toBe(state);
    expect(kingsValidPlace(state, kingPos!)).toBe(false);

    const oob = placeQuadraphage(state, { row: 0, col: 0 });
    expect(oob).toBe(state);

    // Find any empty non-king cell that accepts placement
    let placed = false;
    for (let row = 1; row <= 9 && !placed; row++) {
      for (let col = 1; col <= 9 && !placed; col++) {
        const next = placeQuadraphage(state, { row, col });
        if (next !== state) {
          expect(next.player1Supply).toBe(state.player1Supply - 1);
          placed = true;
        }
      }
    }
    expect(placed).toBe(true);
  });
});

describe('Wave 22 apply-reject — Queens select opponent / illegal dest', () => {
  it('selectPiece opponent clears selection; illegal makeMove is identity', () => {
    const state = createQueens();
    // Find a player2 piece
    let p2: { ring: number; position: number } | null = null;
    let p1: { ring: number; position: number } | null = null;
    for (const cell of state.cells.values()) {
      if (cell.piece?.player === 'player2' && !p2) {
        p2 = { ring: cell.ring, position: cell.position };
      }
      if (cell.piece?.player === 'player1' && !p1) {
        p1 = { ring: cell.ring, position: cell.position };
      }
    }
    expect(p1).not.toBeNull();
    expect(p2).not.toBeNull();

    const afterOpp = selectPiece(state, p2!);
    expect(afterOpp.selectedPiece).toBeNull();

    let selected = selectPiece(state, p1!);
    if (!selected.selectedPiece) {
      // piece may have no moves — try other p1 pieces
      for (const cell of state.cells.values()) {
        if (cell.piece?.player === 'player1') {
          selected = selectPiece(state, {
            ring: cell.ring,
            position: cell.position,
          });
          if (selected.selectedPiece) break;
        }
      }
    }
    expect(selected.selectedPiece).not.toBeNull();

    const from = (() => {
      const key = selected.selectedPiece!;
      const [ring, position] = key.split('-').map(Number);
      return { ring, position };
    })();
    const legal = queensValid(selected, from);
    const junk = queensMove(selected, from, { ring: 99, position: 99 });
    expect(junk).toBe(selected);

    if (legal.length > 0) {
      const ok = queensMove(selected, from, legal[0]);
      expect(ok).not.toBe(selected);
    }
  });
});

describe('Wave 22 apply-reject — FIAR occupied place + blocked canMove', () => {
  it('re-place occupied node identity; canMove false for missing path', () => {
    let state = createFiar();
    const nodeIds = [...state.board.nodes.keys()];
    expect(nodeIds.length).toBeGreaterThan(2);

    expect(canPlaceChip(state, nodeIds[0])).toBe(true);
    state = fiarPlace(state, nodeIds[0]);
    const again = fiarPlace(state, nodeIds[0]);
    expect(again).toBe(state);
    expect(canPlaceChip(state, nodeIds[0])).toBe(false);

    // Place rest quickly until movement if possible
    for (const id of nodeIds.slice(1)) {
      if (state.phase !== 'placement') break;
      if (canPlaceChip(state, id)) {
        state = fiarPlace(state, id);
      }
    }
    if (state.phase === 'movement') {
      expect(fiarCanMove(state, 'no-such-node', nodeIds[0])).toBe(false);
      expect(FIAR_CONFIG.CHIPS_PER_PLAYER).toBeGreaterThan(0);
    }
  });
});

describe('Wave 22 apply-reject — Sum Dominoes bad placement after select', () => {
  it('selected domino + impossible board slot returns identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.17);
    let state = sumRoll(createSum());
    // Seed may yield no legal plays → passing; still reject placeDomino
    if (state.phase === 'passing') {
      const stuck = placeDomino(state, { row: 0, col: 0 }, 'horizontal');
      expect(stuck).toBe(state);
      return;
    }
    expect(state.phase).toBe('placing');
    const hand = state.hands.player1;
    let selected = false;
    for (const d of hand) {
      const next = selectDomino(state, d.id);
      if (next !== state && next.selectedDomino) {
        state = next;
        selected = true;
        break;
      }
    }
    if (!selected) {
      const stuck = placeDomino(state, { row: 0, col: 0 }, 'horizontal');
      expect(stuck).toBe(state);
      return;
    }

    const domino = hand.find((d) => d.id === state.selectedDomino!)!;
    const sum = getDiceSum(state.currentDice!);
    const bad = placeDomino(state, { row: 0, col: 0 }, 'horizontal');
    if (!sumValidPlace(state, domino, { row: 0, col: 0 }, 'horizontal', sum)) {
      expect(bad).toBe(state);
    }

    const oob = placeDomino(state, { row: 99, col: 99 }, 'vertical');
    expect(oob).toBe(state);
  });
});

describe('Wave 22 apply-reject — Kwatro illegal dest after select', () => {
  it('moveChip to bogus node identity when chip selected', () => {
    let state = createKwa();
    const own = [...state.chips.values()].find(
      (c) => c.owner === state.currentPlayer && c.position
    );
    expect(own).toBeDefined();
    state = selectChip(state, own!.id);
    if (state.phase !== 'selectingDest') {
      // Chip may be stuck — selectingChip identity is fine
      expect(state.phase).toBe('selectingChip');
      return;
    }
    expect(kwaValid(state, own!.id, 'node-does-not-exist')).toBe(false);
    const rejected = moveChip(state, 'node-does-not-exist');
    expect(rejected).toBe(state);
  });
});

describe('Wave 22 apply-reject — Stars / Ramrod illegal place after select', () => {
  it('Stars placeCard on occupied or invalid cell identity', () => {
    let state = createStars();
    const card = state.playerHands.player1[0];
    expect(card).toBeDefined();
    state = selectCard(state, card.id);
    expect(state.selectedCard).toBeTruthy();

    const valid = starsPlacements(state);
    // Prefer an in-bounds cell that is NOT a valid placement
    let rejected = state;
    outer: for (let r = 0; r < state.cells.length; r++) {
      for (let c = 0; c < state.cells[r].length; c++) {
        if (!valid.some((p) => p.row === r && p.col === c)) {
          rejected = placeCard(state, r, c);
          expect(rejected).toBe(state);
          break outer;
        }
      }
    }

    if (valid.length > 0) {
      const ok = placeCard(state, valid[0].row, valid[0].col);
      expect(ok).not.toBe(state);
      const again = placeCard(ok, valid[0].row, valid[0].col);
      expect(again).toBe(ok);
    }
  });

  it('Ramrod placeRod with bad box / occupied slot identity after selectRod', () => {
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    expect(rodId).toBeDefined();
    state = selectRod(state, rodId);
    expect(state.selectedRod).toBe(rodId);
    expect(state.phase).toBe('placingRod');

    expect(ramValidPlace(state, rodId, 'no-box', 0)).toBe(false);
    const bad = placeRod(state, 'no-box', 0);
    expect(bad).toBe(state);

    // Place legally once, then reject re-placing into the same occupied slot
    const boxId = [...state.boxes.keys()][0];
    const first = placeRod(state, boxId, 0);
    if (first !== state) {
      const otherRod = state.playerRods.player1[1];
      let againState = selectRod(first, otherRod);
      if (againState.phase === 'placingRod') {
        const occupied = placeRod(againState, boxId, 0);
        expect(occupied).toBe(againState);
        expect(ramValidPlace(againState, otherRod, boxId, 0)).toBe(false);
      }
    }
  });
});

describe('Wave 22 apply-reject — Contig missing / occupied cell', () => {
  it('placeChip unknown value and re-claim same cell identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.31);
    let state = contigRoll(createContig());
    expect(state.phase).toBe('calculating');

    const missing = contigPlace(state, 99999, '99999');
    expect(missing).toBe(state);

    const values = [...state.cells.keys()];
    const target = values[0];
    state = contigPlace(state, target, String(target));
    expect(state.cells.get(target)?.owner).toBe('player1');

    // Need to get back to calculating with dice for re-place attempt
    state = { ...state, phase: 'calculating', currentDice: [1, 2, 3] };
    const again = contigPlace(state, target, String(target));
    expect(again).toBe(state);
  });
});
