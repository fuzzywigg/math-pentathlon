/**
 * Wave 65 leftover after tip/#315 — Kwatro winner banner margin 1rem.
 * Wave63 locks size/anim; deepen margin leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject banner margin 1rem', () => {
  it('winner banner uses margin 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?margin:\s*1rem/);
  });
});
