/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball newGameVsHuman phase leftover.
 * Wave55 covered newGameVsAI(hard) only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — vs human', () => {
  it('newGameVsHuman stays answering with challenge leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsHuman();
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentChallenge).not.toBeNull();
    expect(getCurrentState().roundNumber).toBe(1);
    expect(root.querySelectorAll('.pinball-choice-btn')).toHaveLength(4);
  });
});
