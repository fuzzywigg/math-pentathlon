/**
 * Wave 48 — Ramrod injectRamrodStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — inject styles', () => {
  beforeEach(() => document.getElementById('ramrod-styles')?.remove());
  it('idempotent', () => {
    injectRamrodStyles();
    injectRamrodStyles();
    expect(document.querySelectorAll('#ramrod-styles').length).toBe(1);
  });
});
