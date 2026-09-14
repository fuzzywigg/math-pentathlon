/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball layout size constants.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — layout sizes', () => {
  it('container max-width 800px and gap 16px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('max-width: 800px');
    expect(css).toContain('gap: 16px');
    expect(css).toContain('flex-direction: column');
  });
});
