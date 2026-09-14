/**
 * Wave 51 leftover after #233 — Handshake Blue/Red names cross. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { renderStatus as hexStatus } from '../../src/games/hex/board-ui';
import { renderStatus as hexagoneStatus } from '../../src/games/hex-a-gone/board-ui';
import { renderScores as starsScores, getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';
import { renderScores as parScores } from '../../src/games/par-55/board-ui';
import { getPlayerName as kwaName } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 handshake — Blue/Red names', () => {
  it('exposes Blue/Red across hex/hexagone/stars/par/kwatro', () => {
    const hexEl = document.createElement('div');
    hexStatus(hexInit(5), hexEl, 'human-vs-human');
    expect(hexEl.textContent).toMatch(/Blue/);
    expect(hexEl.textContent).toMatch(/Red/);

    const hag = document.createElement('div');
    hexagoneStatus(hexagoneInit(), hag);
    expect(hag.textContent).toMatch(/Blue|You|Player/i);

    expect(starsScores(starsInit()).textContent).toMatch(/Blue/);
    expect(starsScores(starsInit()).textContent).toMatch(/Red/);
    expect(starsName('player1')).toBe('Blue');
    expect(starsName('player2')).toBe('Red');

    expect(parScores(parInit()).textContent).toMatch(/Blue/);
    expect(parScores(parInit()).textContent).toMatch(/Red/);

    expect(kwaName('player1')).toBe('Blue');
    expect(kwaName('player2')).toBe('Red');
  });
});
