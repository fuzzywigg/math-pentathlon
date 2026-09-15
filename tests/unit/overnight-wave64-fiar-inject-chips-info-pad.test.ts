/**
 * Wave 64 leftover after #305 — FIAR chips-info padding chrome.
 * Wave58 pins gap 2rem + 0.9rem type; deepen 0.5rem pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 64 fiar — inject chips-info pad', () => {
  it('chips-info uses 0.5rem padding', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chips-info');
    expect(css).toContain('padding: 0.5rem');
  });
});
