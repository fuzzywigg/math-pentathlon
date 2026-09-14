/**
 * Wave 41 HEAVY — handshake: sum-dominoes × ramrod × queens variety.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as sdInit } from '../../src/games/sum-dominoes/rules';
import { getOpponent as sdOpponent } from '../../src/games/sum-dominoes/types';
import {
  createInitialState as ramrodInit,
  hasValidMoves as ramrodHasValidMoves,
  passTurn as ramrodPass,
} from '../../src/games/ramrod/rules';
import {
  createInitialState as qgInit,
  getOpponent as qgOpponent,
} from '../../src/games/queens-guards/types';
import {
  checkWinner as qgCheckWinner,
  hasValidMoves as qgHasValidMoves,
} from '../../src/games/queens-guards/rules';

describe('Wave 41 handshake — sum-dominoes × ramrod × queens', () => {
  it('triple opening: all player1, none won', () => {
    const s = sdInit();
    const r = ramrodInit();
    const q = qgInit();
    expect([s.currentPlayer, r.currentPlayer, q.currentPlayer]).toEqual([
      'player1',
      'player1',
      'player1',
    ]);
    expect(s.winner).toBeNull();
    expect(r.winner).toBeNull();
    expect(q.winner).toBeNull();
    expect(qgCheckWinner(q)).toBeNull();
  });

  it('phase diversity: rolling vs selectingRod vs piece-select board', () => {
    expect(sdInit().phase).toBe('rolling');
    expect(ramrodInit().phase).toBe('selectingRod');
    expect(qgInit().selectedPiece).toBeNull();
    expect(qgHasValidMoves(qgInit())).toBe(true);
  });

  it('opponent helpers align across sum-dominoes and queens', () => {
    expect(sdOpponent('player1')).toBe(qgOpponent('player1'));
    expect(sdOpponent('player2')).toBe(qgOpponent('player2'));
  });

  it('ramrod pass flips seat without touching sum-dominoes/queens state shape', () => {
    const r = ramrodPass(ramrodInit());
    expect(r.currentPlayer).toBe('player2');
    expect(sdInit().currentPlayer).toBe('player1');
    expect(qgInit().currentPlayer).toBe('player1');
    expect(typeof ramrodHasValidMoves(ramrodInit())).toBe('boolean');
  });

  it('sum-dominoes center board occupied; queens cells populated', () => {
    const s = sdInit();
    const q = qgInit();
    const occupied = s.board.flat().filter((c) => c !== null);
    expect(occupied.length).toBeGreaterThanOrEqual(1);
    expect(q.cells.size).toBeGreaterThan(0);
  });
});
