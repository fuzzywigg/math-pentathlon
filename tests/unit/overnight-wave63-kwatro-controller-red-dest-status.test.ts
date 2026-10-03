/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro Red dest status exact.
 * Wave57 locks Blue dest; deepen Red selectingDest chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { passTurn, selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 63 kwatro — red dest status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('after Red selectChip shows Click a green space to move', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = passTurn(ctrl.state);
    ctrl.state = selectChip(ctrl.state, 'p2-0');
    ctrl.update();
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-status')?.textContent).toBe(
      '🔴 Red - Click a green space to move'
    );
  });
});
