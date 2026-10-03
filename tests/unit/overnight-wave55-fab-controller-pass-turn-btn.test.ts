/**
 * Wave 55 leftover after #249/#250 — Fab Pass Turn when no valid moves. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — controller pass turn', () => {
  it('opening omits controls; jammed pool shows Pass Turn and flips seat', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    expect(container.querySelector('.fab-controls')).toBeNull();

    const bars = new Map(ctrl.state.fractionBars);
    const ids = [...bars.keys()];
    for (let i = 0; i < ids.length - 1; i++) {
      bars.set(ids[i], { ...bars.get(ids[i])!, used: true });
    }
    ctrl.state = { ...ctrl.state, fractionBars: bars };
    ctrl.update();

    const pass = [...container.querySelectorAll('.fab-btn-secondary')].find((b) =>
      /Pass Turn/.test(b.textContent ?? '')
    );
    expect(pass).toBeTruthy();
    expect(ctrl.state.currentPlayer).toBe('player1');
    pass!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.currentPlayer).toBe('player2');
  });
});
