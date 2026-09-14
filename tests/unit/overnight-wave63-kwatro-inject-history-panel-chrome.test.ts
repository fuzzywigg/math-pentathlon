/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro history panel chrome.
 * Wave60 locks seat tints; deepen panel max-width + muted bg. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject history panel chrome', () => {
  it('history panel is 250px max with muted rgba bg', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-history');
    expect(css).toContain('max-width: 250px');
    expect(css).toContain('background: rgba(0,0,0,0.05)');
    expect(css).toContain('padding: 1rem');
  });
});
