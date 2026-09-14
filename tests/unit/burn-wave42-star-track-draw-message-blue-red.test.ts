/** Wave 42 — Star Track draw / Blue / Red phase messages. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — draw message blue red', () => {
  it('draw with null winner uses exhausted chains wording', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: null,
    };
    expect(getPhaseMessage(state)).toBe(`It's a draw! All chains exhausted.`);
  });

  it('player1 win message uses Blue', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getPhaseMessage(state)).toBe('Blue wins!');
  });

  it('player2 win message uses Red', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toBe('Red wins!');
  });

  it('drawChains message includes Blue for player1', () => {
    const msg = getPhaseMessage({
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'drawChains',
    });
    expect(msg).toContain('Blue');
    expect(msg).toMatch(/Draw chains/);
  });

  it('selectChain message includes Red for player2', () => {
    const msg = getPhaseMessage({
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectChain',
    });
    expect(msg).toContain('Red');
    expect(msg).toMatch(/Choose a chain/);
  });
});
