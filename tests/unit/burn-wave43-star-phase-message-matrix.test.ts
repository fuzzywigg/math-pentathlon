/**
 * Wave 43 TOKENMAXX — Star Track getPhaseMessage matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPhaseMessage } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 43 star-track — phase messages', () => {
  it('covers draw / select / win / draw-tie / default', () => {
    const base = createInitialState();
    expect(getPhaseMessage(base)).toContain('Draw chains');
    expect(
      getPhaseMessage({ ...base, phase: 'selectChain', currentPlayer: 'player2' })
    ).toContain('Choose a chain');
    expect(
      getPhaseMessage({ ...base, phase: 'gameOver', winner: 'player1' })
    ).toContain('wins');
    expect(
      getPhaseMessage({ ...base, phase: 'gameOver', winner: null })
    ).toContain('draw');
    expect(
      getPhaseMessage({ ...base, phase: 'moving' as typeof base.phase })
    ).toBe('');
  });
});
