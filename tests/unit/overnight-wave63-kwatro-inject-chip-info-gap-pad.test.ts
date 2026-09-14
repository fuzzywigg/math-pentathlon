/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro chip-info gap/pad.
 * Wave60 locks #333 + seat vars; deepen gap/padding/radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject chip-info gap/pad', () => {
  it('chip-info uses 2rem gap, 1rem 2rem pad, 8px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-chip-info');
    expect(css).toContain('gap: 2rem');
    expect(css).toContain('padding: 1rem 2rem');
    expect(css).toContain('border-radius: 8px');
  });
});
