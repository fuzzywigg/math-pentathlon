/**
 * Wave 56 leftover after #256 — Hex HvH Blue/Red Wins grammar. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — HvH winners', () => {
  it('Blue Wins and Red Wins (with trailing s)', () => {
    const base = createInitialState(5);
    const blue = document.createElement('div');
    renderStatus({ ...base, winner: 'player1' }, blue);
    expect(blue.querySelector('.status-winner')?.textContent).toMatch(/Blue Wins!/);
    const red = document.createElement('div');
    renderStatus({ ...base, winner: 'player2' }, red);
    expect(red.querySelector('.status-winner')?.textContent).toMatch(/Red Wins!/);
  });
});
