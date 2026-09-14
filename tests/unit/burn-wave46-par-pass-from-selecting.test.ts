/**
 * Wave 46 — Par 55 passTurn from selectingBlock leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/par-55/rules';

describe('Wave 46 par — pass from selecting', () => {
  it('pass without selection still flips seat', () => {
    const next = passTurn(createInitialState());
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBlock');
  });
});
