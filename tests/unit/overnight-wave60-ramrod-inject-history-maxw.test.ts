/**
 * Wave 60 leftover after tip/#279 — Ramrod history max-width 200px.
 * Distinct from wave58 capture line copy. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject history maxw', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-history max-width 200px', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/\.ramrod-history\s*\{[^}]*max-width:\s*200px/);
  });
});
