/**
 * Wave 66 leftover after tip/#316 — Juggle inject dice-area column.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject dice area column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects dice-area column/center/pad/gap', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*padding:\s*1rem/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
