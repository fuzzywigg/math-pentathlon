/**
 * Wave 68 leftover after tip/#336 — Kwatro opening status player1 class.
 * Status copy covered; deepen class leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 68 kwatro — controller status player1 class', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('opening status has kwa-status and player1 classes', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const status = root.querySelector('.kwa-status');
    expect(status?.classList.contains('kwa-status')).toBe(true);
    expect(status?.classList.contains('player1')).toBe(true);
  });
});
