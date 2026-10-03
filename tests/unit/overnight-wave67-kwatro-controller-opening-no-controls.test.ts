/**
 * Wave 67 leftover after tip/#324 — Kwatro opening has no controls chrome.
 * Controls mount only with selection/pass; deepen empty opening leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller opening no controls', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('newGameVsHuman opening omits .kwa-controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-board')).toBeTruthy();
    expect(root.querySelector('.kwa-controls')).toBeNull();
  });
});
