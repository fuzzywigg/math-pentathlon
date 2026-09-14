/**
 * Wave 48 — Ramrod isValidPlacement ghost box/rod ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, isValidPlacement } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — ghost box/rod', () => {
  it('false for missing box or rod ids', () => {
    const s = createInitialState();
    const rodId = s.playerRods.player1[0];
    expect(isValidPlacement(s, rodId, 'box-99-99', 0)).toBe(false);
    expect(isValidPlacement(s, 'no-such-rod', 'box-0-0', 0)).toBe(false);
  });
});
