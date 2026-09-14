/**
 * Wave 49 leftover after #221/#226/#227 — Sum inject + exact Blue/Red. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectSDStyles, getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — inject exact names', () => {
  beforeEach(() => document.getElementById('sd-styles')?.remove());
  it('idempotent inject; exact Blue/Red', () => {
    injectSDStyles();
    injectSDStyles();
    expect(document.querySelectorAll('#sd-styles')).toHaveLength(1);
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
