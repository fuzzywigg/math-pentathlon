/**
 * Wave 68 leftover after tip/#336 — Kwatro game-area wrapper present.
 * Board present covered; deepen game-area leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 68 kwatro — controller game-area present', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('updateUI mounts .kwa-game-area root', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-game-area')).toBeTruthy();
  });
});
