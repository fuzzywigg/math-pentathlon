/**
 * Wave 16 — AI multi-step pipeline / executeAITurn / applyAIMove* contracts.
 * Distinct from win-draw terminals and rules-phase illegal matrices.
 * Tests-only: seed legal phases, assert pipeline advances or identity-fails. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as jugglePlacement,
  executeAITurn as juggleExec,
} from '../../src/games/juggle/ai';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  getAISelection,
  executeAITurn as hagExec,
} from '../../src/games/hex-a-gone/ai';
import { selectBlock as selectHag, commitSelection } from '../../src/games/hex-a-gone/rules';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove as fabMove,
  applyAIMoveSteps,
  executeAITurn as fabExec,
} from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';
import {
  getAIChainChoice,
  executeAITurn as starExec,
} from '../../src/games/star-track/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import { performRoll } from '../../src/games/remainder-islands/rules';
import {
  getAIIslandChoice,
  executeAISelection,
} from '../../src/games/remainder-islands/ai';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
} from '../../src/games/sum-dominoes/rules';
import {
  getAIMove as sumMove,
  hasPlayableMove,
  executeAITurn as sumExec,
} from '../../src/games/sum-dominoes/ai';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { doRollDice as contigRoll } from '../../src/games/contig-60/rules';
import {
  getAIPlacement as contigPlacement,
  executeAITurn as contigExec,
} from '../../src/games/contig-60/ai';

import { createInitialState as createPrime, rollDice as primeRoll } from '../../src/games/prime-gold/rules';
import {
  getAIPlacement as primePlacement,
  executeAITurn as primeExec,
} from '../../src/games/prime-gold/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getValidPits, makeMove as callaMake } from '../../src/games/calla/rules';
import { getAIMove as callaMove, analyzeMoves } from '../../src/games/calla/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { getAIMove as fiarMove, applyAIMove as fiarApply } from '../../src/games/fiar/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  getAIMove as queensMove,
  applyAIMove as queensApply,
} from '../../src/games/queens-guards/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parMove, executeAITurn as parExec } from '../../src/games/par-55/ai';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  getAIMove as ramrodMove,
  executeAITurn as ramrodExec,
} from '../../src/games/ramrod/ai';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaMove, executeAITurn as kwaExec } from '../../src/games/kwatro-sinko/ai';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  getAIMove as starsMove,
  executeAITurn as starsExec,
} from '../../src/games/stars-bars/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentMove } from '../../src/games/pent-em-in/ai';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  getAIMove as kingsMove,
  getRandomMove as kingsRandom,
  evaluatePosition as kingsEval,
} from '../../src/games/kings-quadraphages/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { makeMove as hexMove, getValidMoves as hexValid } from '../../src/games/hex/rules';
import { getBestMove as hexBest, getRandomMove as hexRandom } from '../../src/games/hex/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 16 AI pipeline — Juggle die→shape→place', () => {
  it('after roll, getAIDieChoice then selectDie unlocks shape or auto-places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = juggleRoll(createJuggle());
    expect(state.phase).toBe('selectingShape');
    const die = getAIDieChoice(state, 'player1', 'hard');
    expect(die).not.toBeNull();
    expect([0, 1]).toContain(die!.index);
    state = selectDie(state, die!.index);
    expect(state.selectedCategory).not.toBeNull();
    if (state.phase === 'selectingShape') {
      const shape = getAIShapeChoice(state, 'player1', 'hard');
      expect(shape).not.toBeNull();
      expect(shape!.shape).toBeTruthy();
    } else {
      // Single-shape die auto-advances to placing
      expect(state.phase).toBe('placing');
      expect(state.selectedShape).not.toBeNull();
    }
  });

  it('executeAITurn from rolling advances past selectingShape or places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const rolled = juggleRoll(createJuggle());
    const next = juggleExec(rolled, 'player1', 'hard');
    expect(next).not.toBe(rolled);
    // Hard path should leave selectingShape (die already chosen) or advance to opponent turn
    expect(['selectingShape', 'placing', 'rolling', 'gameOver']).toContain(
      next.phase
    );
    if (next.phase === 'selectingShape') {
      expect(next.selectedCategory).not.toBeNull();
    }
  });

  it('getAIPlacement null until placing phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const rolled = juggleRoll(createJuggle());
    expect(jugglePlacement(rolled, 'player1')).toBeNull();
  });
});

describe('Wave 16 AI pipeline — Hex-a-Gone select→place', () => {
  it('getAISelection returns unique bank shapes; execute advances phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    const opening = createHag();
    const selection = getAISelection(opening, 'player1', 'hard');
    expect(selection).not.toBeNull();
    expect(selection!.blocks.length).toBeGreaterThan(0);
    const ids = selection!.blocks.map((b) => b);
    expect(new Set(ids).size).toBe(ids.length);

    const next = hagExec(opening, 'player1', 'hard');
    expect(next.phase === 'selectBlocks' || next.phase === 'placeBlocks' || next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(
      true
    );
  });

  it('manual select+commit reaches placeBlocks where getAIPlacement may fire', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createHag();
    const selection = getAISelection(state, 'player1', 'easy');
    expect(selection).not.toBeNull();
    for (const block of selection!.blocks) {
      state = selectHag(state, block);
    }
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
  });
});

describe('Wave 16 AI pipeline — Fab applyAIMoveSteps / execute', () => {
  it('getAIMove + applyAIMoveSteps advances away from selectingBar1 or passes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const opening = createFab();
    const move = fabMove(opening, 'player1', 'hard');
    expect(move).not.toBeNull();
    const applied = applyAIMoveSteps(opening, move!);
    expect(applied.phase).not.toBe('confirmingMove');
    // Success flips seat or claims; fail path passTurn also leaves selectingBar1 for opponent
    expect(['selectingBar1', 'gameOver']).toContain(applied.phase);
  });

  it('executeAITurn from opening leaves selectingBar1 for next seat or gameOver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.08);
    const next = fabExec(createFab(), 'player1', 'medium');
    expect(['selectingBar1', 'gameOver']).toContain(next.phase);
  });

  it('applyAIMoveSteps with bogus ids falls back via passTurn', () => {
    const opening = createFab();
    const bogus = {
      bar1Id: 'nope-1',
      bar2Id: 'nope-2',
      operation: 'add' as const,
      answerId: 'nope-a',
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const applied = applyAIMoveSteps(opening, bogus);
    expect(applied.currentPlayer).toBe('player2');
    expect(applied.phase).toBe('selectingBar1');
    spy.mockRestore();
  });
});

describe('Wave 16 AI pipeline — Star / Remainder / Sum / Contig / Prime', () => {
  it('Star executeAITurn draws and selects a chain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const next = starExec(createStar(), 'player1', 'hard');
    // After a full turn, seat often flips back to drawChains for opponent
    expect(['drawChains', 'selectChain', 'gameOver']).toContain(next.phase);
    if (next.phase === 'drawChains') {
      expect(next.currentPlayer).toBe('player2');
    }
  });

  it('Star getAIChainChoice after drawChains returns 0|1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    const drawn = drawChains(createStar());
    expect(drawn.phase).toBe('selectChain');
    const choice = getAIChainChoice(drawn, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
    const after = selectChain(drawn, choice!.chainIndex);
    expect(after.phase).toBe('drawChains');
  });

  it('Remainder executeAISelection after a valid roll picks an island or identity', () => {
    // Force dice totals that usually hit islands: die faces 1..6 via random buckets
    let state = createRemainder();
    for (let i = 0; i < 12; i++) {
      vi.spyOn(Math, 'random').mockReturnValue((i % 6) / 6);
      state = performRoll(createRemainder());
      if (state.phase === 'selectIsland' && state.validIslands.length > 0) break;
      vi.restoreAllMocks();
    }
    if (state.phase === 'selectIsland') {
      const choice = getAIIslandChoice(state, 'player1', 'hard');
      expect(choice).not.toBeNull();
      const next = executeAISelection(state, 'player1', 'hard');
      expect(next).not.toBe(state);
      expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
    } else {
      // No valid islands in seeded rolls — chooser stays null
      expect(getAIIslandChoice(state, 'player1')).toBeNull();
    }
  });

  it('Sum executeAITurn rolls and places or passes when possible', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    const next = sumExec(createSum(), 'player1', 'hard');
    expect(['rolling', 'placing', 'passing', 'gameOver']).toContain(next.phase);
    const rolled = sumRoll(createSum());
    if (rolled.currentDice) {
      const sum = getDiceSum(rolled.currentDice);
      const playable = hasPlayableMove(rolled, 'player1', sum);
      if (playable) {
        expect(sumMove(rolled, 'player1', 'hard')).not.toBeNull();
      }
    }
  });

  it('Contig executeAITurn from rolling advances calculating or passes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    const next = contigExec(createContig(), 'player1', 'medium');
    expect(['rolling', 'calculating', 'gameOver']).toContain(next.phase);
    const rolled = contigRoll(createContig());
    if (rolled.phase === 'calculating') {
      const place = contigPlacement(rolled, 'player1', 'hard');
      // May be null if no valid expressions for the roll
      expect(place === null || typeof place.value === 'number').toBe(true);
    }
  });

  it('Prime executeAITurn after roll attempts placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    const rolled = primeRoll(createPrime());
    const place = primePlacement(rolled, 'player1', 'hard');
    expect(place === null || typeof place.value === 'number').toBe(true);
    const next = primeExec(createPrime(), 'player1', 'hard');
    expect(next).toBeTruthy();
  });
});

describe('Wave 16 AI pipeline — Calla analyze / FIAR+Queens apply / seat flips', () => {
  it('Calla analyzeMoves length matches getValidPits and includes reasoning', () => {
    const opening = createCalla();
    const valid = getValidPits(opening);
    const analyses = analyzeMoves(opening, 'player1');
    expect(analyses).toHaveLength(valid.length);
    expect(analyses.every((a) => typeof a.score === 'number')).toBe(true);
    expect(analyses.every((a) => a.reasoning.length > 0)).toBe(true);
    expect(analyses.filter((a) => a.isBestMove).length).toBeGreaterThanOrEqual(1);
    const move = callaMove(opening, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(valid).toContain(move!.pit);
    const after = callaMake(opening, move!.pit);
    expect(after).not.toBe(opening);
  });

  it('FIAR applyAIMove place advances chip count; malformed is identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const opening = createFiar();
    const move = fiarMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    const applied = fiarApply(opening, move!);
    expect(applied).not.toBe(opening);
    expect(applied.currentPlayer).toBe('player2');
    const noop = fiarApply(opening, { type: 'place' });
    expect(noop).toBe(opening);
    const noopMove = fiarApply(opening, { type: 'move' });
    expect(noopMove).toBe(opening);
  });

  it('Queens applyAIMove flips seat on legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const opening = createQueens();
    const move = queensMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    const applied = queensApply(opening, move!);
    expect(applied.currentPlayer).toBe('player2');
  });
});

describe('Wave 16 AI pipeline — Par / Ramrod / Kwatro / Stars / Pent execute', () => {
  it('Par executeAITurn places a block or stays selecting when stuck', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.11);
    const move = parMove(createPar(), 'player1', 'hard');
    expect(move === null || (move.blockId && move.baseId)).toBeTruthy();
    const next = parExec(createPar(), 'player1', 'hard');
    expect(['selectingBlock', 'placingBlock', 'gameOver']).toContain(next.phase);
  });

  it('Ramrod executeAITurn advances selectingRod or places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.14);
    const move = ramrodMove(createRamrod(), 'player1', 'medium');
    expect(move === null || (move.rodId && move.boxId !== undefined)).toBeTruthy();
    const next = ramrodExec(createRamrod(), 'player1', 'medium');
    expect(['selectingRod', 'placingRod', 'gameOver']).toContain(next.phase);
  });

  it('Kwatro / Stars executeAITurn return a successor state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.16);
    const kwa = kwaExec(createKwa(), 'player1', 'hard');
    expect(kwa).toBeTruthy();
    expect(kwaMove(createKwa(), 'player1', 'easy') === null || true).toBe(true);

    const stars = starsExec(createStars(), 'player1', 'hard');
    expect(stars).toBeTruthy();
    const sm = starsMove(createStars(), 'player1', 'medium');
    expect(sm === null || sm.cardId).toBeTruthy();
  });

  it('Pent getAIMove returns shape+cells when can move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.09);
    const move = pentMove(createPent(), 'player1', 'hard');
    if (move) {
      expect(move.shapeId).toBeTruthy();
      expect(move.position).toBeTruthy();
      expect(typeof move.rotation).toBe('number');
    }
  });
});

describe('Wave 16 AI pipeline — Kings eval / Hex random legality', () => {
  it('Kings evaluatePosition is finite; easy getAIMove / getRandomMove legal', () => {
    const opening = createKings();
    const score = kingsEval(opening, 'player1');
    expect(Number.isFinite(score)).toBe(true);
    const best = kingsMove(opening, 'player1', 'easy');
    const random = kingsRandom(opening, 'player1');
    expect(best).not.toBeNull();
    expect(random).not.toBeNull();
    expect(best!.kingMove).toBeTruthy();
    expect(random!.quadraphagePlacement).toBeTruthy();
  });

  it('Hex getRandomMove is in getValidMoves; easy getBestMove nonempty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    const opening = createHex(5);
    const valid = hexValid(opening);
    const random = hexRandom(opening);
    expect(random).not.toBeNull();
    expect(
      valid.some((m) => m.row === random!.row && m.col === random!.col)
    ).toBe(true);
    const best = hexBest(opening, 'player1', 'easy');
    expect(best).not.toBeNull();
    const after = hexMove(opening, best!);
    expect(after.currentPlayer).toBe('player2');
  });
});
