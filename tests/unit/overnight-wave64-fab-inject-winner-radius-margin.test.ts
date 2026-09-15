/**
 * Wave 64 leftover after #305 — Fab winner-banner radius + margin.
 * Wave63 pins gradient shorthand; deepen 12px radius + 1rem margin. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject winner radius margin', () => {
  it('winner banner uses 12px radius and 1rem margin', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-winner-banner');
    expect(css).toContain('border-radius: 12px');
    expect(css).toContain('margin: 1rem');
  });
});
