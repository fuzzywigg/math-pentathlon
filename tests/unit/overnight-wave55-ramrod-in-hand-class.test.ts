/**
 * Wave 55 leftover after #250 — Ramrod in-hand class on player rod chrome.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — in-hand class', () => {
  it('marks every player rod as in-hand', () => {
    const s = createInitialState();
    const el = renderPlayerRods(s, 'player2', () => undefined);
    const rods = el.querySelectorAll('.ramrod-rod');
    expect(rods.length).toBe(s.playerRods.player2.length);
    expect([...rods].every((r) => r.classList.contains('in-hand'))).toBe(true);
  });
});
