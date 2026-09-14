/**
 * Wave 48 — Calla getPhaseMessage Red + animating leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Wave 48 calla — phase messages Red/animating', () => {
  it('Red selectPit and animating messages; tie gameOver', () => {
    const red = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(getPhaseMessage(red)).toMatch(/^Red/);
    const anim = { ...createInitialState(), phase: 'animating' as const };
    expect(getPhaseMessage(anim)).toMatch(/distributing/);
    const tie = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'tie' as const,
    };
    expect(getPhaseMessage(tie)).toMatch(/tie/i);
  });
});
