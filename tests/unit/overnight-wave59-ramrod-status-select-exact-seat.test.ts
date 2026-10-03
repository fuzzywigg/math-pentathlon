/**
 * Wave 59 leftover after #279 — Ramrod opening select status with seat exact.
 * Distinct from wave56 regex /Select a rod/. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 59 ramrod — status select exact seat', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it("opening shows Blue's turn - Select a rod with seat icon", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      "🔵 Blue's turn - Select a rod"
    );
  });
});
