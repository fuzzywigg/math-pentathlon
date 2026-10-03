/**
 * Wave 58 leftover after #275 — Sum controls mount when passing. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — controls when passing', () => {
  it('mounts .sd-controls with Pass Turn in passing phase', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      winner: null,
    };
    ctrl.update();
    expect(root.querySelector('.sd-controls')).toBeTruthy();
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
