/**
 * Wave 41 — Calla isGameOver / getPhaseMessage / empty-history lastMoveInfo.
 * Phase message matrix + winner flags. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import {
  isGameOver,
  getPhaseMessage,
  getLastMoveInfo,
  makeMove,
} from '../../src/games/calla/rules';

describe('Wave 41 calla — gameOver / phase msg / empty history', () => {
  it('getLastMoveInfo is null on empty history', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();
  });

  it('isGameOver false on opening; true via phase or winner', () => {
    expect(isGameOver(createInitialState())).toBe(false);
    expect(
      isGameOver({ ...createInitialState(), phase: 'gameOver', winner: 'player1' })
    ).toBe(true);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'selectPit',
        winner: 'player2',
      })
    ).toBe(true);
    expect(
      isGameOver({ ...createInitialState(), phase: 'gameOver', winner: 'tie' })
    ).toBe(true);
  });

  it('getPhaseMessage matrix for select / animating / over', () => {
    expect(getPhaseMessage(createInitialState())).toMatch(/Blue.*Select/i);
    expect(
      getPhaseMessage({
        ...createInitialState(),
        currentPlayer: 'player2',
      })
    ).toMatch(/Red.*Select/i);
    expect(
      getPhaseMessage({ ...createInitialState(), phase: 'animating' })
    ).toMatch(/distributing/i);
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toMatch(/Blue wins/);
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player2',
      })
    ).toMatch(/Red wins/);
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'tie',
      })
    ).toMatch(/tie/i);
  });

  it('side-empty sweep ends game and sets winner', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 20,
      player2Calla: 0,
    };
    const next = makeMove(state, 0);
    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(getPhaseMessage(next)).toMatch(/Blue wins/);
  });
});
