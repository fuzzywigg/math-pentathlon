/**
 * Wave 49 — Handshake frac-fact inject + names. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { getPlayerName, injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 handshake — frac-fact ui', () => {
  beforeEach(() => {
    document.getElementById('frac-fact-styles')?.remove();
  });
  it('injects and names', () => {
    injectFracFactStyles();
    expect(document.getElementById('frac-fact-styles')).toBeTruthy();
    expect(getPlayerName('player1')).toBe('Blue');
  });
});
