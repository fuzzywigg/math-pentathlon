/**
 * Wave 68 leftover after tip/#336 — Kwatro newGameVsAI hard difficulty.
 * Wave67 medium default; deepen hard leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 68 kwatro — controller vs-ai hard', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('newGameVsAI hard sets difficulty hard', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('hard');
  });
});
