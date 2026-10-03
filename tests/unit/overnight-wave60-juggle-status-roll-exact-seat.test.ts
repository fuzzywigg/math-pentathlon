/**
 * Wave 60 leftover after tip/#279 — Juggle rolling status exact seat copy.
 * Tightens wave56 soft /Roll the dice/. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

describe('Wave 60 juggle — status roll exact seat', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('opens with exact Blue seat roll instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.querySelector('.juggle-status')?.textContent?.trim()).toBe(
      "🔵 Blue's turn - Roll the dice"
    );
  });
});
