/**
 * Wave 42 HEAVY — handshake: kings × remainder × pinball resource opens.
 * Leftover engines (not #187 set). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState as kingsInit,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';
import {
  createInitialState as remInit,
  getPlayerChips,
  getPlayerScore,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';
import {
  createInitialState as pinInit,
  getPlayerStats,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';

describe('Wave 42 handshake — kings × remainder × pinball', () => {
  it('resource meters start full and equal across seats', () => {
    const k = kingsInit();
    const r = remInit();
    const p = pinInit();
    expect(getSupply(k, 'player1')).toBe(getSupply(k, 'player2'));
    expect(getPlayerChips(r, 'player1')).toBe(getPlayerChips(r, 'player2'));
    expect(getPlayerStats(p, 'player1').ballsRemaining).toBe(
      getPlayerStats(p, 'player2').ballsRemaining
    );
    expect(getPlayerChips(r, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerStats(p, 'player1').ballsRemaining).toBe(INITIAL_BALLS);
  });

  it('opening phases are primary actions', () => {
    expect(kingsInit().turnPhase).toBe('moveKing');
    expect(remInit().phase).toBe('rolling');
    expect(pinInit().phase).toBe('answering');
  });

  it('scores start at zero', () => {
    const r = remInit();
    const p = pinInit();
    expect(getPlayerScore(r, 'player1')).toBe(0);
    expect(getPlayerScore(r, 'player2')).toBe(0);
    expect(getPlayerStats(p, 'player1').score).toBe(0);
    expect(getPlayerStats(p, 'player2').score).toBe(0);
  });

  it('winners null and seats player1', () => {
    for (const s of [kingsInit(), remInit(), pinInit()]) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
    }
  });
});
