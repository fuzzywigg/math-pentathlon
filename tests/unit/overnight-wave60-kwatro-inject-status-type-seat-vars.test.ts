/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro status type + seat color vars.
 * Wave57 covers status text exact; deepen inject font-size + color vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject status type / seat vars', () => {
  it('status is 1.2rem / 500 with player color vars', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-status');
    expect(css).toContain('font-size: 1.2rem');
    expect(css).toContain('font-weight: 500');
    expect(css).toContain('.kwa-status.player1');
    expect(css).toContain('color: var(--color-player1, #2196f3)');
    expect(css).toContain('.kwa-status.player2');
    expect(css).toContain('color: var(--color-player2, #f44336)');
  });
});
