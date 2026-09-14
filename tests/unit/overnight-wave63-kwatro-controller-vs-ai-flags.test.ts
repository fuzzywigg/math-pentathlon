/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro newGameVsAI flags.
 * No prior controller vs-AI flag chrome. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 63 kwatro — vs AI flags', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('newGameVsAI sets isAI + player2 AI on hard', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(root.querySelector('.kwa-board')).toBeTruthy();
    expect(root.querySelector('.kwa-status')?.textContent).toContain("Blue's turn");
  });
});
