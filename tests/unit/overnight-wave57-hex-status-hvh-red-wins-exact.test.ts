/**
 * Wave 57 leftover after #263 — Hex HvH Red Wins! exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hex — HvH Red wins', () => {
  it('status-winner shows Red Wins!', () => {
    const state = { ...createInitialState(5), winner: 'player2' as const };
    const el = document.createElement('div');
    renderStatus(state, el, 'human-vs-human');
    const turn = el.querySelector('.status-turn');
    expect(turn?.classList.contains('status-winner')).toBe(true);
    expect(turn?.textContent).toBe('🔴 Red Wins!');
  });
});
