/**
 * Wave 65 leftover after tip/#315 — Juggle inject hint align/margin.
 * Wave62 locked hint font-size/color; deepen align/margin. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject hint align margin', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-hint text-align center + margin-top 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*margin-top:\s*0\.5rem/);
  });
});
