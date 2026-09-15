/**
 * Wave 67 leftover after tip/#324 — Kwatro Clear Selection btn classes.
 * Wave57 locks Clear text; deepen secondary class leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 67 kwatro — controller clear btn classes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('Clear Selection uses kwa-btn kwa-btn-secondary', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    const btn = [...root.querySelectorAll('button')].find(
      (b) => b.textContent === 'Clear Selection'
    );
    expect(btn?.className).toBe('kwa-btn kwa-btn-secondary');
  });
});
