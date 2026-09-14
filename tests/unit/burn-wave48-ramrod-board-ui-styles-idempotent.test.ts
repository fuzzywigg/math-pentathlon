/**
 * Wave 48 — Ramrod injectRamrodStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — styles idempotent', () => {
  it('repeated inject stays bounded', () => {
    const before = document.head.querySelectorAll('style').length;
    injectRamrodStyles();
    injectRamrodStyles();
    expect(document.head.querySelectorAll('style').length - before).toBeLessThanOrEqual(2);
  });
});
