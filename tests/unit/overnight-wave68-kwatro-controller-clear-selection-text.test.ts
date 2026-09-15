/**
 * Wave 68 leftover after tip/#336 — Kwatro Clear Selection button text.
 * Wave67 locked classes; deepen text leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 68 kwatro — controller clear selection text', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('Clear Selection button text exact when chip selected', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    const btn = [...root.querySelectorAll('button')].find(
      (b) => b.textContent === 'Clear Selection'
    );
    expect(btn?.textContent).toBe('Clear Selection');
  });
});
