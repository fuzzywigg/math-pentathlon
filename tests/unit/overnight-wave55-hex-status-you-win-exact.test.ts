/**
 * Wave 55 leftover after #250 — Hex HvA You Win grammar (no trailing s). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — You Win', () => {
  it('HvA player1 winner is You Win! not Wins', () => {
    const el = document.createElement('div');
    renderStatus({ ...createInitialState(5), winner: 'player1' }, el, 'human-vs-ai');
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/You Win!/);
    expect(el.querySelector('.status-winner')?.textContent).not.toMatch(/You Wins/);
  });
});
