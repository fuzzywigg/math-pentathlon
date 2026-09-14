/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro selectable-chip hover body.
 * Wave57 only matches selector; deepen scale + brightness. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject chip hover scale', () => {
  it('selectable-chip:hover scales 1.1 and brightens 1.1', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-selectable-chip:hover');
    expect(css).toContain('transform: scale(1.1)');
    expect(css).toContain('filter: brightness(1.1)');
  });
});
