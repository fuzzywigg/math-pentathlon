/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro game-area layout chrome.
 * Wave60 locked board/status/btn fills; deepen unsaturated .kwa-game-area. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject game-area chrome', () => {
  it('game-area is column flex with 1rem gap and padding', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-game-area');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('align-items: center');
    expect(css).toContain('gap: 1rem');
    expect(css).toContain('padding: 1rem');
  });
});
