/**
 * Overnight HEAVY after #214/#215 — Ramrod UI inject + names leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRamrodStyles, getPlayerName } from '../../src/games/ramrod/board-ui';

afterEach(() => document.getElementById('ramrod-styles')?.remove());

describe('Overnight ramrod — board-ui', () => {
  it('distinct names; styles idempotent', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    injectRamrodStyles();
    injectRamrodStyles();
    expect(document.getElementById('ramrod-styles')).toBeTruthy();
  });
});
