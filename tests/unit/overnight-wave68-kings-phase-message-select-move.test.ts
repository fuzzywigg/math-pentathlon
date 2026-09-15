/**
 * Wave 68 leftover after tip/#336 — Kings phase messages select/move/place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState, getCurrentPhaseMessage, selectKing } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 68 kings — phase message select move', () => {
  it('moveKing unselected/selected + place messages exact', () => {
    const state = createInitialGameState();
    expect(getCurrentPhaseMessage(state)).toBe('Player 1: Click your King to select it');
    const selected = selectKing(state);
    expect(getCurrentPhaseMessage(selected)).toBe('Player 1: Click a green square to move');
  });
});
