/**
 * Wave 43 — Calla getPhaseMessage select/animating/win matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Wave 43 calla — phase message matrix', () => {
  it('covers selectPit, animating, and seat wins', () => {
    expect(getPhaseMessage(createInitialState())).toContain('Blue');
    const anim = { ...createInitialState(), phase: 'animating' as const, currentPlayer: 'player2' as const };
    expect(getPhaseMessage(anim)).toContain('Red');
    expect(getPhaseMessage(anim)).toContain('distributing');
    const win = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getPhaseMessage(win)).toBe('Blue wins!');
  });
});
