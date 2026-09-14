/**
 * Overnight HEAVY leftover after #234 — Handshake Blue/Red across calla/juggle/ramrod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderStatus as callaStatus } from '../../src/games/calla/board-ui';
import { getPlayerName as juggleName } from '../../src/games/juggle/board-ui';
import { getPlayerName as ramrodName } from '../../src/games/ramrod/board-ui';

describe('Wave 52 handshake — Blue/Red names', () => {
  it('calla status + juggle/ramrod getPlayerName agree on Blue/Red', () => {
    const el = document.createElement('div');
    callaStatus(callaInit(), el, 'human-vs-human');
    expect(el.textContent).toMatch(/Blue/);
    expect(el.textContent).toMatch(/Red/);
    for (const get of [juggleName, ramrodName]) {
      expect(get('player1')).toBe('Blue');
      expect(get('player2')).toBe('Red');
    }
  });
});
