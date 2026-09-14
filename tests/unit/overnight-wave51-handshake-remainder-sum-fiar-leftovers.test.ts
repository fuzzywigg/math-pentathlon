/**
 * Overnight HEAVY leftovers after #234/#235 — Handshake mounts remainder/sum/fiar leftovers.
 * Distinct from #235 hex/hexagone/stars/par/kwatro handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { renderBoard as renderRem, getPlayerName as remName } from '../../src/games/remainder-islands/board-ui';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { renderBoard as renderSum, getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { renderBoard as renderFiar, getPlayerName as fiarName } from '../../src/games/fiar/board-ui';

describe('Wave 51 handshake — remainder/sum/fiar leftovers', () => {
  it('mounts leftover chrome and Blue/Red names', () => {
    expect(renderRem(remInit(), () => undefined, () => undefined).querySelectorAll('.island').length).toBeGreaterThan(0);
    expect(renderSum(sumInit(), () => undefined).querySelector('.sd-domino')).toBeTruthy();
    expect(renderFiar(fiarInit(), () => undefined).querySelectorAll('[data-node-id]').length).toBe(25);
    for (const getName of [remName, sumName, fiarName]) {
      expect(getName('player1')).toBe('Blue');
      expect(getName('player2')).toBe('Red');
    }
  });
});
