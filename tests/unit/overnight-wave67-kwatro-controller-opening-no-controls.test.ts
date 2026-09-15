/**
 * Wave 67 leftover after tip/#324 — Kwatro opening omits controls.
 * Soft board mount; deepen no-controls leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller opening no controls', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('opening mount has board but no controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-board')).toBeTruthy();
    expect(root.querySelector('.kwa-controls')).toBeNull();
  });
});
