/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro Red win + winning-expr DOM.
 * Complements Blue win chrome; locks expression textContent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 60 kwatro — red win + winning expr', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('player2 winner shows Red chrome and alignment expression', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
      winningAlignment: {
        nodes: ['n2-1', 'n2-2', 'n2-3'],
        chips: [],
        expression: '6 + 3 - 5 = 4',
        result: 4,
      },
    };
    ctrl.update();
    expect(root.querySelector('.kwa-status')?.textContent).toBe('🔴 Red wins!');
    expect(root.querySelector('.kwa-winner-banner')?.textContent).toBe(
      'Red Wins! 🎉'
    );
    expect(root.querySelector('.kwa-winning-expr')?.textContent).toBe(
      '6 + 3 - 5 = 4'
    );
  });
});
