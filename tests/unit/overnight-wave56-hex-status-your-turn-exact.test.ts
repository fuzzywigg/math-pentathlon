/**
 * Wave 56 leftover after #256 — Hex HvA Your turn exact copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — Your turn copy', () => {
  it('HvA opening shows Your turn - Click to place', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-ai');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'Your turn - Click to place'
    );
  });
});
