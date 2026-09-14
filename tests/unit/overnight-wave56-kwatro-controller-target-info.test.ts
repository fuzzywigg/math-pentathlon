/**
 * Wave 56 leftover after #256 — Kwatro target-info a+b-c chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 56 kwatro — target info', () => {
  it('mounts a + b - c = 4 or 5 target chrome', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    newGameVsHuman(el);
    const info = el.querySelector('.kwa-target-info');
    expect(info?.textContent).toMatch(/a \+ b - c = 4 or 5/);
    expect(info?.querySelector('strong')?.textContent).toBe('a + b - c = 4 or 5');
  });
});
