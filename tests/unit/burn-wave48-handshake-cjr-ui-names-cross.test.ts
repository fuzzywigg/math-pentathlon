/**
 * Wave 48 — Juggle×Ramrod Blue/Red name parity (+ calla status). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as jName } from '../../src/games/juggle/board-ui';
import { getPlayerName as rName } from '../../src/games/ramrod/board-ui';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 48 handshake — CJR UI names', () => {
  it('juggle/ramrod Blue/Red match; calla status echoes Blue', () => {
    expect(jName('player1')).toBe(rName('player1'));
    expect(jName('player2')).toBe(rName('player2'));
    const el = document.createElement('div');
    renderStatus(createInitialState(), el);
    expect(el.textContent).toMatch(/Blue/);
  });
});
