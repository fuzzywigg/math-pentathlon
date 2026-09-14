/**
 * Wave 48 — Juggle canMakeAnyMove false with null dice. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, canMakeAnyMove } from '../../src/games/juggle/rules';

describe('Wave 48 juggle — canMove null dice', () => {
  it('false when currentDice is null', () => {
    expect(canMakeAnyMove(createInitialState())).toBe(false);
  });
});
