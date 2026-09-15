/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject banner margin.
 * Wave63 locks 1.5rem + kwa-glow anim; deepen margin: 1rem. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject banner margin', () => {
  it('winner-banner has margin 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?margin:\s*1rem/);
  });
});
