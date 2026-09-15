/**
 * Wave 67 leftover after tip/#336 — FIAR chip-count flex gap.
 * Soft chip-count; lock display flex + gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject chip-count flex gap', () => {
  it('chip-count is flex with gap 0.5rem', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-count\s*\{[\s\S]*?display:\s*flex[\s\S]*?gap:\s*0\.5rem/
    );
  });
});
