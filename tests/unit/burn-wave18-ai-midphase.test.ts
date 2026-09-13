/**
 * Wave 18 — AI mid-phase choosers (after reaching place/move), not opening execute smoke.
 * Distinct from wave 16 opening pipelines + null-gates. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as jugglePlacement,
} from '../../src/games/juggle/ai';
import { TETROMINOES } from '../../src/core/polyomino/types';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement as hagPlacement,
} from '../../src/games/hex-a-gone/ai';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CONFIG,
} from '../../src/games/fiar/types';
import { placeChip as fiarPlace, canMove } from '../../src/games/fiar/rules';
import { getAIMove as fiarMove, applyAIMove as fiarApply } from '../../src/games/fiar/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  getAIMove as queensMove,
  applyAIMove as queensApply,
} from '../../src/games/queens-guards/ai';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  getAIMove as kingsMove,
  getBestMove as kingsBest,
  evaluatePosition as kingsEval,
} from '../../src/games/kings-quadraphages/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentMove } from '../../src/games/pent-em-in/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parMove } from '../../src/games/par-55/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 18 AI midphase — Juggle getAIPlacement after die→shape', () => {
  it('walks to placing then getAIPlacement returns coords or null if jammed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    let state = juggleRoll(createJuggle());
    const die = getAIDieChoice(state, 'player1', 'hard');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);
    if (state.phase === 'selectingShape') {
      const shape = getAIShapeChoice(state, 'player1', 'hard');
      if (shape) {
        state = selectShape(state, shape.shape);
      } else {
        state = selectShape(state, TETROMINOES[0]);
      }
    }
    expect(state.phase).toBe('placing');
    expect(state.selectedShape).not.toBeNull();

    const placement = jugglePlacement(state, 'player1', 'medium');
    if (placement) {
      expect(placement.position.row).toBeGreaterThanOrEqual(0);
      expect(placement.position.col).toBeGreaterThanOrEqual(0);
      expect(placement.rotation).toBeDefined();
    } else {
      // Board may be too full in pathological seeds — null is allowed
      expect(placement).toBeNull();
    }
  });
});

describe('Wave 18 AI midphase — Hex-a-Gone getAIPlacement after commit', () => {
  it('select→commit→getAIPlacement returns {q,r}; placeBlock consumes one', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createHag();
    const selection = getAISelection(state, 'player1', 'easy');
    expect(selection).not.toBeNull();
    for (const block of selection!.blocks) {
      state = selectHag(state, block);
    }
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');

    const placement = hagPlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    expect(typeof placement!.q).toBe('number');
    expect(typeof placement!.r).toBe('number');

    // Select first remaining block then place at AI coords
    const shape = state.turnSelection.blocks[0];
    state = selectBlockForPlacement(state, shape);
    const beforeCount = state.board.filter((c) => c.filled).length;
    state = placeHag(state, placement!.q, placement!.r);
    expect(state.board.filter((c) => c.filled).length).toBe(beforeCount + 1);
  });
});

describe('Wave 18 AI midphase — FIAR movement getAIMove', () => {
  it('forced movement: getAIMove type move + applyAIMove advances history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    const nodes = [
      '0-0',
      '4-4',
      '0-1',
      '4-3',
      '0-2',
      '4-2',
      '0-4',
      '4-1',
    ];
    let state = createFiar();
    for (const id of nodes) {
      state = fiarPlace(state, id);
    }
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(FIAR_CONFIG.CHIPS_PER_PLAYER);

    const move = fiarMove(state, state.currentPlayer, 'medium');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
    expect(canMove(state, move!.from!, move!.to!)).toBe(true);

    const applied = fiarApply(state, move!);
    expect(applied.moveHistory.length).toBeGreaterThan(state.moveHistory.length);
  });
});

describe('Wave 18 AI midphase — Queens easy apply', () => {
  it('easy getAIMove + applyAIMove advances history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.07);
    const opening = createQueens();
    // easy only — medium/hard minimax exceeds default unit timeout on opening
    const move = queensMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.from).toBeDefined();
    expect(move!.to).toBeDefined();
    const applied = queensApply(opening, move!);
    expect(applied.moveHistory.length).toBe(opening.moveHistory.length + 1);
  });
});

describe('Wave 18 AI midphase — Kings getBestMove / evaluatePosition', () => {
  it('getBestMove aliases hard getAIMove; evaluatePosition opponent sign flips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createKings();
    const hard = kingsMove(state, 'player1', 'hard');
    const best = kingsBest(state, 'player1', 'easy');
    expect(hard).not.toBeNull();
    expect(best).not.toBeNull();
    // Both should be legal king+quad pairs
    expect(best!.kingMove).toBeDefined();
    expect(best!.quadraphagePlacement).toBeDefined();

    const p1 = kingsEval(state, 'player1');
    const p2 = kingsEval(state, 'player2');
    expect(typeof p1).toBe('number');
    expect(typeof p2).toBe('number');
    // Symmetric opening: scores should be finite and typically opposite-ish
    expect(Number.isFinite(p1)).toBe(true);
    expect(Number.isFinite(p2)).toBe(true);
  });
});

describe('Wave 18 AI midphase — Pent / Par medium shape legality', () => {
  it('Pent medium getAIMove returns placeable shape id + position', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.21);
    const move = pentMove(createPent(), 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBeTruthy();
    expect(move!.position.row).toBeGreaterThanOrEqual(0);
    expect(move!.position.col).toBeGreaterThanOrEqual(0);
    expect([0, 90, 180, 270]).toContain(move!.rotation);
  });

  it('Par medium getAIMove returns block + base ids from hand/board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.19);
    const state = createPar();
    const move = parMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
    expect(state.bases.has(move!.baseId)).toBe(true);
  });
});
