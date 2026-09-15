/**
 * Wave 64 leftover after #305 — Fab answer-wrapper transition chrome.
 * Wave58 pins bar-wrapper transition; deepen answer-wrapper leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject answer-wrapper transition', () => {
  it('answer-wrapper uses 4px pad and 0.15s transition', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-answer-wrapper');
    expect(css).toContain('padding: 4px');
    expect(css).toContain('transition: all 0.15s ease');
  });
});
