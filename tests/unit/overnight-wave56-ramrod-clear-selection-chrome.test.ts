/**
 * Wave 56 leftover after #256 — Ramrod Clear Selection button chrome.
 * Distinct from clearSelection rules unit tests. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';
import { selectRod } from '../../src/games/ramrod/rules';

describe('Wave 56 ramrod — clear selection chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('shows Clear Selection and click returns to selectingRod', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const rodId = ctrl.state.playerRods.player1[0];
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    const btn = [...root.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent === 'Clear Selection'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(ctrl.state.selectedRod).toBeNull();
  });
});
