/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro winner banner size/anim.
 * Wave60 locks gold gradient + glow shadows; deepen 1.5rem + animation name. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject banner size/anim', () => {
  it('winner-banner is 1.5rem bold with kwa-glow animation', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-winner-banner');
    expect(css).toContain('font-size: 1.5rem');
    expect(css).toContain('padding: 1.5rem');
    expect(css).toContain(
      'animation: kwa-glow 1s ease-in-out infinite alternate'
    );
  });
});
