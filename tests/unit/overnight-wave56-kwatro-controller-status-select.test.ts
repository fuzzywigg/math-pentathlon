/**
 * Wave 56 leftover after #256 — Kwatro controller Select chip / green space. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 56 kwatro — controller status', () => {
  it('opening Select a chip; selectingDest green space copy', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    expect(el.querySelector('.kwa-status')?.textContent).toMatch(
      /Blue's turn - Select a chip to move/
    );
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    expect(el.querySelector('.kwa-status')?.textContent).toMatch(
      /Blue - Click a green space to move/
    );
  });
});
