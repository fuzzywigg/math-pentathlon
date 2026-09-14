/**
 * Overnight HEAVY — Prime Gold injectPrimeGoldStyles idempotent.
 * Distinct leftover board-ui cold path. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

beforeEach(() => {
  // module-level stylesInjected flag means second call always no-ops after first in process
});

describe('Overnight prime — inject styles', () => {
  it('injectPrimeGoldStyles is callable without throwing', () => {
    expect(() => injectPrimeGoldStyles()).not.toThrow();
    expect(() => injectPrimeGoldStyles()).not.toThrow();
  });
});
