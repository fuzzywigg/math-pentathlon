/**
 * Wave 59 Contig/SD residual — Sum initGame human defaults. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — init defaults', () => {
  it('defaults to human vs human medium with enabled roll', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('medium');
    const btn = root.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});
