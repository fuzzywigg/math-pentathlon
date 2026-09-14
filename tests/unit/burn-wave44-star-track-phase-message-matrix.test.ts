/**
 * Wave 44 — Star Track getPhaseMessage leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage, isGameOver } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — phase message matrix', () => {
  it('messages cover draw/select/win/draw-settle; isGameOver gates', () => {
    const s = createInitialState();
    expect(getPhaseMessage(s)).toMatch(/Draw chains/i);
    expect(getPhaseMessage({ ...s, phase: 'selectChain' })).toMatch(/Choose/i);
    expect(getPhaseMessage({ ...s, phase: 'gameOver', winner: 'player1' })).toMatch(/wins/i);
    expect(getPhaseMessage({ ...s, phase: 'gameOver', winner: null })).toMatch(/draw/i);
    expect(isGameOver(s)).toBe(false);
    expect(isGameOver({ ...s, phase: 'gameOver', winner: 'player2' })).toBe(true);
  });

  it('moving phase falls through to empty default', () => {
    const s = { ...createInitialState(), phase: 'moving' as const };
    expect(getPhaseMessage(s)).toBe('');
  });
});
