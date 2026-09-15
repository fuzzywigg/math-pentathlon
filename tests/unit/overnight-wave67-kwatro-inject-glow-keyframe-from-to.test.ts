/**
 * Wave 67 leftover after tip/#324 — Kwatro glow keyframe from/to bodies.
 * Wave60 locks shadow values separately; deepen from/to block leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject glow keyframe from/to', () => {
  it('kwa-glow keyframe locks from/to box-shadow bodies', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }');
    expect(css).toContain('to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }');
  });
});
