/**
 * Wave 56 leftover after #256 — Calla phase message exact select/animating.
 * Complements burn-wave41 regex; exact strings for both seats. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Wave 56 calla — phase message exact', () => {
  it('uses exact select-shield and distributing copy per seat', () => {
    expect(getPhaseMessage(createInitialState())).toBe(
      "Blue's turn - Select a shield to distribute"
    );
    expect(
      getPhaseMessage({ ...createInitialState(), currentPlayer: 'player2' })
    ).toBe("Red's turn - Select a shield to distribute");
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'animating',
        currentPlayer: 'player2',
      })
    ).toBe('Red is distributing cubes...');
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toBe('Blue wins!');
  });
});
