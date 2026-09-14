/**
 * Wave 58 Contig/SD residual — Sum newGameVsAI flags. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsAI } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — newGameVsAI', () => {
  it('sets isAI, aiPlayer player2, hard difficulty', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(root.querySelector('.sd-roll-btn')).toBeTruthy();
  });
});
