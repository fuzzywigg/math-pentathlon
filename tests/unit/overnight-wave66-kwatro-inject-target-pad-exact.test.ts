/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject target pad.
 * Wave63 locks 0.9rem/#666/strong; deepen padding 0.5rem 1rem. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject target pad', () => {
  it('target-info pads 0.5rem 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[\s\S]*?padding:\s*0\.5rem 1rem/);
  });
});
