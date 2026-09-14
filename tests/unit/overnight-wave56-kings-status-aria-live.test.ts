/**
 * Wave 56 leftover after #256 — Kings status live region attrs. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 kings — status a11y', () => {
  it('container is role=status aria-live=polite', () => {
    const el = document.createElement('div');
    renderStatus(createInitialGameState(), el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
