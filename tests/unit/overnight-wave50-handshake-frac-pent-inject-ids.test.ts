/**
 * Overnight HEAVY leftover after #229 — Handshake inject style ids frac/pent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 handshake — inject styles', () => {
  beforeEach(() => {
    document.getElementById('frac-fact-styles')?.remove();
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('frac/pent style ids stay single; prime inject is callable', () => {
    injectFracFactStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    injectFracFactStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    expect(document.querySelectorAll('#frac-fact-styles').length).toBe(1);
    expect(document.querySelectorAll('#pent-em-in-styles').length).toBe(1);
  });
});
