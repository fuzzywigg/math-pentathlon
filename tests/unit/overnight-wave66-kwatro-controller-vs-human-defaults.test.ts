/**
 * Wave 66 leftover after tip/#316 — Kwatro vs-human defaults.
 * Soft elsewhere; deepen isAI/aiPlayer/medium leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 66 kwatro — controller vs human defaults', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('vs-human keeps isAI false and medium difficulty', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('medium');
  });
});
