/**
 * Overnight TOKENMAXX HEAVY — frac-fact names + styles leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getPlayerName, injectFracFactStyles, renderScores } from '../../src/games/frac-fact/board-ui';
import { createInitialState } from '../../src/games/frac-fact/types';

beforeEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });
afterEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });

describe('Overnight frac-fact — names + styles + scores', () => {
  it('seat names differ', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });

  it('inject styles idempotent', () => {
    injectFracFactStyles();
    const n = document.querySelectorAll('style').length;
    injectFracFactStyles();
    expect(document.querySelectorAll('style').length).toBe(n);
  });

  it('renderScores mounts seat score chrome', () => {
    const el = renderScores(createInitialState());
    expect(el.className).toMatch(/frac/);
    expect(el.textContent?.length).toBeGreaterThan(0);
  });
});
