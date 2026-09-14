/**
 * Wave 55 leftover after #250 — Hex HvA AI Wins banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — AI Wins', () => {
  it('HvA player2 winner is AI Wins!', () => {
    const el = document.createElement('div');
    renderStatus({ ...createInitialState(5), winner: 'player2' }, el, 'human-vs-ai');
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
  });
});
