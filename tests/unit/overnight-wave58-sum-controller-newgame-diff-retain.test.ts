/**
 * Wave 58 Contig/SD residual — Sum newGame retains AI difficulty. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — newGame diff retain', () => {
  it('keeps hard when newGame(true) omits difficulty; clears on human', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root, true, 'hard');
    ctrl.newGame(true);
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('hard');
  });
});
