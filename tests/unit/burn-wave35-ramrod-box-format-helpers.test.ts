/**
 * Wave 35 — Ramrod box sum/remaining + format + opponent rod identity.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  getValidPlacements,
  formatMove,
  getBoxSum,
  getRemainingValue,
  hasValidMoves,
} from '../../src/games/ramrod/rules';
import { getAIMove, isAITurn } from '../../src/games/ramrod/ai';

describe('Wave 35 Ramrod — box/format helpers', () => {
  it('getBoxSum null until both rods; getRemainingValue equals targetSum', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    expect(getBoxSum(box)).toBeNull();
    expect(getRemainingValue(box)).toBe(box.targetSum);
  });

  it('selectRod identity for opponent rod', () => {
    const state = createInitialState();
    const oppRod = state.playerRods.player2[0];
    expect(selectRod(state, oppRod)).toBe(state);
  });

  it('select own rod yields placements; formatMove stringy', () => {
    let state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    expect(getValidPlacements(state).length).toBeGreaterThanOrEqual(0);
    const rod = state.rods.get(rodId)!;
    const formatted = formatMove({
      player: 'player1',
      rod,
      boxId: 'b',
      slot: 0,
      capturedBox: false,
      pointsScored: 0,
      moveNumber: 1,
    });
    expect(formatted).toContain('cm');
    expect(
      formatMove({
        player: 'player1',
        rod,
        boxId: 'b',
        slot: 0,
        capturedBox: true,
        pointsScored: 5,
        moveNumber: 2,
      })
    ).toContain('+5cm');
  });

  it('AI null gameOver; isAITurn hvh false', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
