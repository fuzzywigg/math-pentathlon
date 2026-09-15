/**
 * Wave 67 leftover after tip/#324 — Kwatro history absent on opening.
 * Soft history panel CSS; deepen absent DOM leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller history absent opening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('opening has main-layout but no history', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-main-layout')).toBeTruthy();
    expect(root.querySelector('.kwa-history')).toBeNull();
  });
});
