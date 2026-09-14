/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro chip-info panel + seat vars.
 * Wave55 covers Even/Odd DOM lists; deepen inject #333 + color vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject chip-info seat vars', () => {
  it('chip-info #333 and player-info seat color vars', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-chip-info');
    expect(css).toContain('background: #333');
    expect(css).toContain('.kwa-player-info.player1');
    expect(css).toContain('color: var(--color-player1, #2196f3)');
    expect(css).toContain('.kwa-player-info.player2');
    expect(css).toContain('color: var(--color-player2, #f44336)');
  });
});
