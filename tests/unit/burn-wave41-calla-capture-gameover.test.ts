/**
 * Wave 41 — Calla capture + side-empty gameOver leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOppositePitIndex,
  type CallaGameState,
} from '../../src/games/calla/types';
import {
  makeMove,
  isGameOver,
  getLastMoveInfo,
  getPhaseMessage,
} from '../../src/games/calla/rules';

describe('Wave 41 Calla — capture and gameOver', () => {
  it('lands in empty own pit and captures opposite cubes into calla', () => {
    const opp = getOppositePitIndex(1);
    // Keep opponent non-empty elsewhere so capture does not trigger side-empty sweep
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 2, 2, 2],
      player2Pits: [1, 0, 0, 0, 0].map((_, i) =>
        i === opp ? 4 : i === 0 ? 1 : 0
      ),
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory[0].captured).toBe(5);
    expect(next.player1Pits[1]).toBe(0);
    expect(next.player2Pits[opp]).toBe(0);
    expect(next.player1Calla).toBe(5);
    expect(next.phase).toBe('selectPit');
    expect(getLastMoveInfo(next)).toMatch(/captured/i);
  });

  it('empty opposite skips capture when landing in empty own pit', () => {
    // Opponent still has cubes so game does not end/sweep
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 1, 1, 1],
      player2Pits: [2, 2, 2, 0, 2],
      player1Calla: 3,
      player2Calla: 3,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.player1Pits[1]).toBe(1);
    expect(next.phase).toBe('selectPit');
  });

  it('emptying opponent side sweeps remaining cubes and sets winner', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 5,
    };
    const next = makeMove(state, 0);
    expect(next.phase).toBe('gameOver');
    expect(isGameOver(next)).toBe(true);
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
    expect(next.winner).toBe('player1');
    expect(getPhaseMessage(next)).toMatch(/Blue wins/);
  });

  it('gameOver tie when callas equal after sweep', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 5,
      player2Calla: 6,
    };
    const next = makeMove(state, 0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('tie');
    expect(getPhaseMessage(next)).toMatch(/tie/i);
  });

  it('isGameOver true when winner set even if phase still selectPit', () => {
    const forged: CallaGameState = {
      ...createInitialState(),
      winner: 'player2',
      phase: 'selectPit',
    };
    expect(isGameOver(forged)).toBe(true);
  });

  it('player2 wins message after gameOver', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
      currentPlayer: 'player2',
    };
    expect(getPhaseMessage(state)).toBe('Red wins!');
  });
});
