/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball status aria-live.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — status aria-live', () => {
  it('status node has role=status and aria-live=polite leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const status = root.querySelector('.pinball-status');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });
});
