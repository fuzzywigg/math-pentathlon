/**
 * Wave 66 leftover after tip/#316 — Fab pulse keyframe ring pair exact.
 * Wave58 soft shadow bodies; lock 0%/50% pair leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject pulse keyframe pair', () => {
  it('fab-pulse expands green ring then fades', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }'
    );
    expect(css).toContain(
      '50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }'
    );
  });
});
