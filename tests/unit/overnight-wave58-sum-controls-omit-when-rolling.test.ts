/**
 * Wave 58 leftover after #275 — Sum controls omit when rolling. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — controls omit rolling', () => {
  it('omits .sd-controls on opening rolling phase', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    expect(root.querySelector('.sd-controls')).toBeNull();
    expect(root.querySelector('.sd-pass-btn')).toBeNull();
  });
});
