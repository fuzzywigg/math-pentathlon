/**
 * Wave 66 leftover after tip/#316 — Kwatro newGameVsAI default medium.
 * Wave63 locks vs-AI flags; deepen default difficulty leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 66 kwatro — controller vs AI default medium', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('newGameVsAI defaults medium with player2 AI', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root);
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('medium');
  });
});
