/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab answer-grid justify center.
 * Wave57 asserted minmax(90px); deepen justify-content leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject answer grid center', () => {
  it('operation buttons and scores justify center', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-operation-buttons');
    expect(css).toContain('justify-content: center');
    expect(css).toContain('repeat(auto-fill, minmax(90px, 1fr))');
  });
});
