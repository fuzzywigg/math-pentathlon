/**
 * Wave 60 leftover after tip/#279 — Ramrod hint italic chrome.
 * Distinct from wave52 hint need copy. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject hint italic', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-hint font-style italic', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/\.ramrod-hint\s*\{[^}]*font-style:\s*italic/);
  });
});
