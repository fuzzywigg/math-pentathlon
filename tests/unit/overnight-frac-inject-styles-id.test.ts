/**
 * Overnight TOKENMAXX HEAVY — frac-fact inject styles id leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

beforeEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
  document.head.innerHTML = '';
});
afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Overnight frac-fact — inject styles id', () => {
  it('uses #frac-fact-styles and is idempotent', () => {
    injectFracFactStyles();
    injectFracFactStyles();
    expect(document.querySelectorAll('#frac-fact-styles').length).toBe(1);
  });
});
