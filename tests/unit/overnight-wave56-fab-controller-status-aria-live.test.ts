/**
 * Wave 56 leftover after #255/#256 — Fab status live region. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — status aria-live', () => {
  it('marks .fab-status role=status and aria-live polite', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    newGameVsHuman(container);
    const status = container.querySelector('.fab-status');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });
});
