/**
 * Wave 59 Contig/SD residual — Sum roll transitions placing or passing. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — roll phase transition', () => {
  it('roll leaves placing or passing with dice set', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    (root.querySelector('.sd-roll-btn') as HTMLButtonElement).click();
    expect(['placing', 'passing']).toContain(ctrl.state.phase);
    expect(ctrl.state.currentDice).not.toBeNull();
    expect(ctrl.state.currentDice).toHaveLength(2);
  });
});
