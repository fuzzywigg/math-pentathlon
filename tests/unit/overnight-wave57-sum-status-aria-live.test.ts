/**
 * Wave 57 leftover after #267 — Sum Dominoes status live region. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — status aria-live', () => {
  it('marks .sd-status role=status and aria-live polite', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const status = root.querySelector('.sd-status');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });
});
