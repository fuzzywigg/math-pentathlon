/**
 * Wave 67 leftover after tip/#324 — Kwatro history absent on opening mount.
 * History title covered when moves exist; deepen absent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller history absent opening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('opening mount has no kwa-history panel', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-history')).toBeNull();
    expect(root.querySelector('.kwa-main-layout')).toBeTruthy();
  });
});
