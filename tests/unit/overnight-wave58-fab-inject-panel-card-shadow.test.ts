/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab panel card shadow chrome.
 * Waves 56–57 covered max-width/mobile/layout; deepen box-shadow literal. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject panel card shadow', () => {
  it('panel cards share soft shadow and 12px radius', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('box-shadow: 0 2px 8px rgba(0,0,0,0.1)');
    expect(css).toContain('border-radius: 12px');
    expect(css).toContain('.fab-bar-pool');
    expect(css).toContain('.fab-answer-board');
    expect(css).toContain('.fab-history');
  });
});
