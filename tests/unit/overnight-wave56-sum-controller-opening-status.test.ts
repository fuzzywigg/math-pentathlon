/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum controller opening status. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller opening status', () => {
  it('opening status Blue roll leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Blue's turn - Roll the dice/
    );
  });
});
