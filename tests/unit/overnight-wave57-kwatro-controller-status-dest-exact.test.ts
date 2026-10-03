/**
 * Wave 57 leftover after #263 — Kwatro selectingDest status exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 57 kwatro — dest status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('after selectChip shows Click a green space to move', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    expect(root.querySelector('.kwa-status')?.textContent).toBe(
      '🔵 Blue - Click a green space to move'
    );
  });
});
