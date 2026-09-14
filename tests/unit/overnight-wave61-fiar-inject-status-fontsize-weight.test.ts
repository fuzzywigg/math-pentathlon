/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR status type chrome.
 * Wave59 pins seat color vars; deepen status size/weight leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject status fontsize weight', () => {
  it('status is 1.2rem weight 500 centered with 1rem pad', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-status');
    expect(css).toContain('text-align: center');
    expect(css).toContain('padding: 1rem');
    expect(css).toContain('font-size: 1.2rem');
    expect(css).toContain('font-weight: 500');
  });
});
