/**
 * Wave 64 leftover after tip/#306 — Kwatro inject history-list display flex.
 * Wave63 locked h4/list chrome; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject history-list display flex', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-history-list display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-history-list\s*\{[^}]*display:\s*flex/);
  });
});
