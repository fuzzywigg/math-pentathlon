/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab btn-secondary fill chrome.
 * Wave54/57 assert class + :hover selector; deepen #e0e0e0/#bdbdbd fills. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject btn-secondary chrome', () => {
  it('secondary button is #e0e0e0 with #bdbdbd hover', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-btn-secondary');
    expect(css).toContain('background: #e0e0e0');
    expect(css).toContain('.fab-btn-secondary:hover');
    expect(css).toContain('background: #bdbdbd');
  });
});
