/**
 * Overnight TOKENMAXX HEAVY — prime-gold inject styles once leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

beforeEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });
afterEach(() => { document.head.innerHTML = ''; document.body.innerHTML = ''; });

describe('Overnight prime — inject styles once', () => {
  it('second inject does not add another style tag in this process after first', () => {
    // Module flag may already be true from prior tests — call twice and ensure non-decreasing by >1
    const before = document.querySelectorAll('style').length;
    injectPrimeGoldStyles();
    const mid = document.querySelectorAll('style').length;
    injectPrimeGoldStyles();
    const after = document.querySelectorAll('style').length;
    expect(after - before).toBeLessThanOrEqual(1);
    expect(after).toBe(mid);
  });
});
