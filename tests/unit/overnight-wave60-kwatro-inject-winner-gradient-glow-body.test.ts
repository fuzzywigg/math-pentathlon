/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro winner gradient + glow bodies.
 * Wave55 names kwa-glow; deepen gradient stops + keyframe box-shadows. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject winner glow body', () => {
  it('winner banner gold gradient and kwa-glow shadow bodies', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffec8b)');
    expect(css).toContain('@keyframes kwa-glow');
    expect(css).toContain('0 0 10px rgba(255,215,0,0.5)');
    expect(css).toContain('0 0 20px rgba(255,215,0,0.8)');
  });
});
