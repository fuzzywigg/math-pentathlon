/**
 * Wave 68 leftover after tip/#336 — Kwatro target-info DOM class.
 * Prefix copy covered; deepen class leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 68 kwatro — controller target-info class', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('target info uses kwa-target-info class', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-target-info')).toBeTruthy();
  });
});
