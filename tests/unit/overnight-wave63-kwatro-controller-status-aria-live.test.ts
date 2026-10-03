/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro status aria-live polite.
 * Wave57/60 lock status copy; deepen markStatusLive leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 63 kwatro — status aria-live', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('status has role=status and aria-live=polite', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const status = root.querySelector('.kwa-status');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });
});
