/**
 * Wave 56 leftover after #255/#256 — FIAR status live region. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fiar/game-controller';
import { mountPair } from '../helpers/mount-pair';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — status aria-live', () => {
  it('marks status root role=status and aria-live polite', () => {
    const { board, status } = mountPair();
    initGame(board, status);
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});
