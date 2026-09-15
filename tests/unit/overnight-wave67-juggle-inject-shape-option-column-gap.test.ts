/**
 * Wave 67 leftover after tip/#323/#324 — shape-option column gap.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject shape-option column gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option column flex + gap 0.25rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*flex-direction:\s*column/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*gap:\s*0\.25rem/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*transition:\s*all 0\.15s/);
  });
});
