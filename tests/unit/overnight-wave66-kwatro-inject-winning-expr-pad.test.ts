/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject winning-expr pad.
 * Wave60/63 lock 1.3rem/bold/gold/#333/radius; deepen padding. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject winning-expr pad', () => {
  it('winning-expr pads 0.5rem 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[\s\S]*?padding:\s*0\.5rem 1rem/);
  });
});
