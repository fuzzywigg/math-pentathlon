/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro player-info font-size.
 * Wave60 locks seat color vars; deepen .kwa-player-info type. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject player-info fontsize', () => {
  it('player-info is 0.9rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-player-info');
    expect(css).toContain('font-size: 0.9rem');
  });
});
