/**
 * Wave 42 — C-slice openings handshake (kwatro×par×pent×prime×queens) after #186.
 * Tests-only. Distinct third leftover lane.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as createKwatro } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { GAMES, getGameById } from '../../src/core/game-registry';

describe('Wave 42 handshake — C-slice catalog openings', () => {
  it('registry exposes all five C-slice games as available', () => {
    for (const id of [
      'kwatro-sinko',
      'par-55',
      'pent-em-in',
      'prime-gold',
      'queens-guards',
    ]) {
      const g = getGameById(id);
      expect(g, id).toBeDefined();
      expect(g!.available).toBe(true);
      expect(GAMES.some((x) => x.id === id)).toBe(true);
    }
  });

  it('each engine boots with player1 and non-gameOver phase', () => {
    const kwa = createKwatro();
    const par = createPar();
    const pent = createPent();
    const prime = createPrime();
    const queens = createQueens();

    expect(kwa.currentPlayer).toBe('player1');
    expect(par.currentPlayer).toBe('player1');
    expect(pent.currentPlayer).toBe('player1');
    expect(prime.currentPlayer).toBe('player1');
    expect(queens.currentPlayer).toBe('player1');

    expect(kwa.phase).not.toBe('gameOver');
    expect(par.phase).not.toBe('gameOver');
    expect(pent.phase).not.toBe('gameOver');
    expect(prime.phase).not.toBe('gameOver');
    expect(queens.winner).toBeNull();
  });

  it('board footprints are non-trivial and distinct', () => {
    expect(createKwatro().nodes.size).toBe(25);
    expect(createPar().bases.size).toBeGreaterThan(20);
    expect(createPent().board.length).toBe(10);
    expect(createPrime().cells.size).toBe(49);
    expect(createQueens().cells.size).toBeGreaterThan(30);
  });
});
