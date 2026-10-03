/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro residual inject × mount handshake.
 * Distinct from wave60 leftover handshake; deepen game-area/controls + Red seat. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { passTurn } from '../../src/games/kwatro-sinko/rules';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 handshake — kwatro residual chrome', () => {
  it('game-area/controls inject + Red select status + tutorial Objective', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-game-area');
    expect(css).toContain('.kwa-controls');
    expect(css).toContain('max-width: 250px');
    expect(css).toContain('padding: 0.75rem 1.5rem');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = passTurn(ctrl.state);
    ctrl.update();
    expect(root.querySelector('.kwa-status')?.textContent).toBe(
      "🔴 Red's turn - Select a chip to move"
    );
    expect(root.querySelector('.kwa-game-area')).toBeTruthy();
    expect(root.querySelector('.kwa-target-info strong')?.textContent).toBe(
      'a + b - c = 4 or 5'
    );

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'objective')?.title
    ).toBe('Objective');
  });
});
