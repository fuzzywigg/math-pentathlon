/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball .pinball-main chrome.
 * Deepen main wrapper after initGame leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 58 pinball controller — main class', () => {
  it('initGame mounts .pinball-main leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.pinball-main')).toBeTruthy();
  });
});
