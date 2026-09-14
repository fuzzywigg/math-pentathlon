/**
 * Overnight HEAVY leftover after #250 — three recorded wins feed winStreak into
 * win-streak-1. Distinct from wave53 isNewBestStreak emit. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlSystem, owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { GAMES } from '../../src/core/game-registry';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  storage.updateSettings({ owlEnabled: true });
  owlSystem.speakNow('flush-wave55', 'happy');
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
});

describe('Wave 55 core owl — winStreak context', () => {
  it('third consecutive win selects win-streak-1 copy', () => {
    for (let i = 0; i < 3; i++) {
      owlSystem.onGameStart(knownGameId);
      owlSystem.onGameEnd(knownGameId, { winner: 'player1', moveCount: 3 });
    }
    const stats = storage.getGameStats(knownGameId);
    expect(stats.currentWinStreak).toBe(3);
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: stats.gamesPlayed,
      winStreak: stats.currentWinStreak,
      gameName: 'Hex',
    });
    expect(msg?.id).toBe('win-streak-1');
    expect(msg?.text).toMatch(/3 wins in a row/i);
  });
});
