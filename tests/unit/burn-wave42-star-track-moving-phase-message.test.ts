/** Wave 42 — Star Track moving phase message is empty. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — moving phase message', () => {
  it('moving phase returns empty string for player1', () => {
    const state = {
      ...createInitialState(),
      phase: 'moving' as const,
      currentPlayer: 'player1' as const,
    };
    expect(getPhaseMessage(state)).toBe('');
  });

  it('moving phase returns empty string for player2', () => {
    const state = {
      ...createInitialState(),
      phase: 'moving' as const,
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toBe('');
  });

  it('drawChains still names Blue for player1', () => {
    const state = {
      ...createInitialState(),
      phase: 'drawChains' as const,
      currentPlayer: 'player1' as const,
    };
    expect(getPhaseMessage(state)).toMatch(/^Blue/);
  });

  it('selectChain still names Red for player2', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toMatch(/^Red/);
  });
});
