/**
 * Wave 68 Remainder residual — VsAI schedules P2 roll/select via setTimeout. Tests-only.
 * Exercises controller AI orchestration without changing rules or scoring.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** Deterministic rolls that still produce valid islands for AI to pick. */
function mockRandomCycle(seed = 0.17): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    return ((seed * 1000 + i * 37) % 1000) / 1000;
  });
}

describe('Wave 68 remainder — AI turn timer', () => {
  it('after P1 island pick, fake timers advance P2 through roll and select', () => {
    vi.useFakeTimers();
    mockRandomCycle();

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    app.appendChild(container);

    initGame(container);
    newGameVsAI('easy');

    click(container.querySelector('.remainder-btn-roll'));
    expect(getCurrentState().phase).toBe('selectIsland');
    expect(getCurrentState().validIslands.length).toBeGreaterThan(0);

    const p1Island = getCurrentState().validIslands[0];
    click(container.querySelector(`[data-island-id="${p1Island}"]`));

    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().currentPlayer).toBe('player2');

    vi.advanceTimersByTime(800);
    expect(['selectIsland', 'rolling', 'gameOver']).toContain(
      getCurrentState().phase
    );

    if (getCurrentState().phase === 'selectIsland') {
      expect(getCurrentState().currentPlayer).toBe('player2');
      expect(getCurrentState().validIslands.length).toBeGreaterThan(0);
      vi.advanceTimersByTime(800);
    }

    expect(['rolling', 'gameOver']).toContain(getCurrentState().phase);
    if (getCurrentState().phase === 'rolling') {
      expect(getCurrentState().currentPlayer).toBe('player1');
      expect(container.querySelector('.remainder-status.player1')).toBeTruthy();
      expect(container.querySelector('.remainder-btn-roll')).toBeTruthy();
    }
    expect(app.dataset.opponent).toBe('ai');
  });
});
