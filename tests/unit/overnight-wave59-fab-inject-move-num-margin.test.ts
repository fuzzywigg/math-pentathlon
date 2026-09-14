/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab move-num margin chrome.
 * Wave53/55 assert DOM move numbers; deepen inject margin-right. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject move-num margin', () => {
  it('move-num is bold with 0.5rem right margin', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-move-num');
    expect(css).toContain('font-weight: bold');
    expect(css).toContain('margin-right: 0.5rem');
  });
});
