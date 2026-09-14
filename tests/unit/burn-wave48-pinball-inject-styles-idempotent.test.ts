/**
 * Wave 48 — Pinball inject styles + names. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles, getPlayerName } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — inject', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());
  it('idempotent; names', () => {
    injectFractionPinballStyles();
    injectFractionPinballStyles();
    expect(document.querySelectorAll('#fraction-pinball-styles').length).toBe(1);
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
