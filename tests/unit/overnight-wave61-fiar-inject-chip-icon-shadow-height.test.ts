/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR chip-icon height/shadow.
 * Wave57 pins width 16px; deepen height + icon shadow leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject chip-icon shadow height', () => {
  it('chip-icon is 16px tall with white border and soft shadow', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chip-icon');
    expect(css).toContain('height: 16px');
    expect(css).toContain('border: 2px solid #fff');
    expect(css).toContain('box-shadow: 0 1px 3px rgba(0,0,0,0.3)');
  });
});
