/**
 * Wave 57 leftover after #267 — Sum layout shell classes. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — layout shell classes', () => {
  it('mounts game-area, main-layout, and dice-area shells', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.sd-game-area')).toBeTruthy();
    expect(root.querySelector('.sd-main-layout')).toBeTruthy();
    expect(root.querySelector('.sd-dice-area')).toBeTruthy();
  });
});
