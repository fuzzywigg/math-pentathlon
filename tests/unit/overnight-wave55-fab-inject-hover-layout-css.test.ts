/**
 * Wave 55 leftover after #249/#250 — Fab hover / layout CSS tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — inject hover layout CSS', () => {
  it('includes main-layout grid, bar hover, op hover, primary hover, media font', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-main-layout');
    expect(css).toContain('grid-template-columns: 1fr 300px');
    expect(css).toContain('.fab-bar-wrapper:not(.fab-bar-disabled):hover');
    expect(css).toContain('translateY(-2px)');
    expect(css).toContain('#e3f2fd');
    expect(css).toContain('.fab-op-btn:hover:not(:disabled)');
    expect(css).toContain('#fff8e1');
    expect(css).toContain('.fab-btn-primary:hover');
    expect(css).toContain('#1976d2');
    expect(css).toContain('font-size: 1.2rem');
  });
});
