/**
 * Wave 64 leftover after tip/#306 — Kwatro newGameVsHuman defaults.
 * Wave63 locked vs-AI hard flags; deepen human defaults leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 64 kwatro — controller vs human defaults', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('newGameVsHuman sets isAI false + null AI + medium difficulty', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('medium');
  });
});
