/**
 * Wave 67 leftover after tip/#324 — Kwatro newGameVsAI default medium.
 * Wave63 locks hard flags; deepen default medium leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller vs-ai default medium', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('newGameVsAI defaults aiDifficulty to medium', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root);
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('medium');
  });
});
