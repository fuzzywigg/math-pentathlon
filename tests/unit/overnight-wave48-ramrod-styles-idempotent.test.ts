/**
 * Wave 48 overnight — Ramrod injectStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

beforeEach(() => {
  document.getElementById('ramrod-styles')?.remove();
});

describe('Wave 48 ramrod overnight — styles idempotent', () => {
  it('second inject does not duplicate style tag', () => {
    injectRamrodStyles();
    injectRamrodStyles();
    expect(document.querySelectorAll('#ramrod-styles')).toHaveLength(1);
  });
});
