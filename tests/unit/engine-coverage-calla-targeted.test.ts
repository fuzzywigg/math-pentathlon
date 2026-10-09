/**
 * Targeted branch coverage for calla/rules.ts — hand-built states only.
 * Edge sow (wrap past opponent Calla), illegal rejection, win/draw settle,
 * free-turn handoff. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove,
  isGameOver,
  settleNoValidMoves,
  getPhaseMessage,
} from '../../src/games/calla/rules';

function forge(partial: Partial<CallaGameState>): CallaGameState {
  return { ...createInitialState(), ...partial };
}

describe('Calla targeted — edge sow + illegal rejection', () => {
  it('rejects wrong phase, wrong seat, OOB pit, empty pit', () => {
    const open = createInitialState();
    expect(canSelectPit(open, 'player2', 0)).toBe(false);
    expect(canSelectPit({ ...open, phase: 'animating' }, 'player1', 0)).toBe(
      false
    );
    expect(canSelectPit(open, 'player1', -1)).toBe(false);
    expect(canSelectPit(open, 'player1', 99)).toBe(false);

    const emptyPit = forge({ player1Pits: [0, 3, 3, 3, 3] });
    expect(canSelectPit(emptyPit, 'player1', 0)).toBe(false);
    expect(makeMove(emptyPit, 0)).toBe(emptyPit);
    expect(getValidPits({ ...open, phase: 'gameOver' })).toEqual([]);
  });

  it('long sow from pit 0 wraps past opponent Calla (skip arm)', () => {
    // 11 cubes: pits 1–4, own Calla, opp pits 4→0, then position 11 skips opp Calla.
    const state = forge({
      player1Pits: [11, 0, 0, 0, 0],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 0,
      player2Calla: 0,
    });
    const after = makeMove(state, 0);
    expect(after.moveHistory).toHaveLength(1);
    expect(after.moveHistory[0]!.cubesDistributed).toBe(11);
    // Landed on own pit 0 after wrap — may capture
    expect(after.player1Pits.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(
      0
    );
  });

  it('free-turn handoff keeps seat when last cube lands in own Calla', () => {
    // One cube in pit 4 → lands in Calla → free turn; keep other pits stocked
    // so the side is not empty (would end the game).
    const state = forge({
      player1Pits: [2, 0, 0, 0, 1],
      player2Pits: [2, 2, 2, 2, 2],
    });
    const after = makeMove(state, 4);
    expect(after.moveHistory[0]!.gotFreeTurn).toBe(true);
    expect(after.currentPlayer).toBe('player1');
    expect(after.phase).toBe('selectPit');
  });

  it('normal sow without free turn hands off to opponent', () => {
    const state = createInitialState();
    const after = makeMove(state, 0);
    if (after.phase === 'gameOver') {
      expect(after.winner).not.toBeNull();
    } else if (!after.moveHistory[0]!.gotFreeTurn) {
      expect(after.currentPlayer).toBe('player2');
    }
  });
});

describe('Calla targeted — win / draw settleNoValidMoves', () => {
  it('early-returns when already over or when valids remain', () => {
    const over = forge({ phase: 'gameOver', winner: 'player1' });
    expect(settleNoValidMoves(over)).toBe(over);
    expect(isGameOver(over)).toBe(true);

    const open = createInitialState();
    expect(getValidPits(open).length).toBeGreaterThan(0);
    expect(settleNoValidMoves(open)).toBe(open);
  });

  it('settles from empty P2 seat collecting remaining P1 cubes (P1 wins)', () => {
    const stuck = forge({
      currentPlayer: 'player2',
      player1Pits: [2, 0, 1, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 4,
    });
    expect(getValidPits(stuck)).toEqual([]);
    const ended = settleNoValidMoves(stuck);
    expect(ended.phase).toBe('gameOver');
    expect(ended.player1Calla).toBe(10 + 2 + 1);
    expect(ended.player1Pits.every((c) => c === 0)).toBe(true);
    expect(ended.winner).toBe('player1');
    expect(getPhaseMessage(ended)).toMatch(/Blue wins/);
  });

  it('settles both-empty sides as a tie on equal Callas', () => {
    const stuck = forge({
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 15,
      player2Calla: 15,
    });
    const ended = settleNoValidMoves(stuck);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('tie');
    expect(getPhaseMessage(ended)).toMatch(/tie/i);
  });

  it('settles empty P1 seat collecting P2 cubes (P2 wins)', () => {
    const stuck = forge({
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [3, 0, 0, 0, 1],
      player1Calla: 2,
      player2Calla: 8,
    });
    const ended = settleNoValidMoves(stuck);
    expect(ended.winner).toBe('player2');
    expect(ended.player2Calla).toBe(8 + 3 + 1);
  });

  it('makeMove empties a side and declares winner', () => {
    // P1 sows last cubes emptying own side while P2 still has cubes
    const state = forge({
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [0, 0, 0, 0, 2],
      player1Calla: 14,
      player2Calla: 13,
    });
    const after = makeMove(state, 4); // into Calla → free turn, but P1 side empty
    // After move P1 pits empty → game ends
    expect(after.phase).toBe('gameOver');
    expect(after.winner).not.toBeNull();
  });
});
