/**
 * Wave 36 — scoring name fallbacks when map omits ids.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  calculateGameResult,
  getPlayerData,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-names — fallback to playerId', () => {
  it('createScoringState uses id as name when map missing', () => {
    const state = createScoringState({}, ['alpha', 'beta'], { alpha: 'Alpha' });
    expect(getPlayerData(state, 'alpha')?.playerName).toBe('Alpha');
    expect(getPlayerData(state, 'beta')?.playerName).toBe('beta');
  });

  it('addPlayer default name equals id', () => {
    let state = createScoringState();
    state = addPlayer(state, 'solo');
    expect(getPlayerData(state, 'solo')?.playerName).toBe('solo');
  });

  it('calculateGameResult surfaces fallback name', () => {
    let state = createScoringState({}, ['x']);
    const result = calculateGameResult(
      {
        ...state,
        players: state.players.map((p) => ({ ...p, total: 5 })),
      },
      1000
    );
    expect(result.winnerId).toBe('x');
    expect(result.winnerName).toBe('x');
  });
});
