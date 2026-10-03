/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball newGameVsAI hard leftover.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 55 pinball controller — vs AI hard', () => {
  it('newGameVsAI(hard) stays answering leftover', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsAI('hard');
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentChallenge).not.toBeNull();
    expect(root.querySelector('.pinball-status.player1')).toBeTruthy();
  });
});
