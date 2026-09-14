/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod hand labels include seat icons.
 * Distinct from wave56 Blue/Red count text. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 58 ramrod — hand seat icons', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('prefixes hand labels with Blue/Red seat icons', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.ramrod-hand-label.player1')?.textContent).toMatch(
      /^🔵 Blue \(/
    );
    expect(root.querySelector('.ramrod-hand-label.player2')?.textContent).toMatch(
      /^🔴 Red \(/
    );
  });
});
