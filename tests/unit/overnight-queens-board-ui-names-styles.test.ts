/**
 * Overnight TOKENMAXX HEAVY — queens-guards names + styles leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getPlayerName, injectQGStyles } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.getElementById('qg-styles')?.remove();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});
afterEach(() => {
  document.getElementById('qg-styles')?.remove();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('Overnight queens — names + styles', () => {
  it('seat names differ', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });

  it('injectQGStyles is idempotent via #qg-styles', () => {
    injectQGStyles();
    injectQGStyles();
    expect(document.querySelectorAll('#qg-styles').length).toBe(1);
  });
});
