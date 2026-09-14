/**
 * Wave 48 — Remainder inject styles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRemainderIslandsStyles, getPlayerName } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — inject + names', () => {
  beforeEach(() => document.getElementById('remainder-islands-styles')?.remove());
  it('idempotent inject; names distinct', () => {
    injectRemainderIslandsStyles();
    injectRemainderIslandsStyles();
    expect(document.querySelectorAll('#remainder-islands-styles').length).toBe(1);
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
