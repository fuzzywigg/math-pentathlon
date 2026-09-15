/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro kwa-glow from/to bodies.
 * Wave60 locks shadow rgba strings; deepen from/to keyframe structure. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject glow from/to bodies', () => {
  it('kwa-glow keyframes use from/to box-shadow bodies', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('@keyframes kwa-glow');
    expect(css).toContain('from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }');
    expect(css).toContain('to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }');
  });
});
