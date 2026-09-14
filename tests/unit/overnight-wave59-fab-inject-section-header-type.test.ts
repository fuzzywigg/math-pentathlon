/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab section-header type chrome.
 * Waves 53–54 assert DOM header copy; deepen inject 1.1rem/#333. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject section header type', () => {
  it('section-header is 1.1rem with #333 and bottom rule', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-section-header');
    expect(css).toContain('font-size: 1.1rem');
    expect(css).toContain('color: #333');
    expect(css).toContain('border-bottom: 2px solid #e0e0e0');
  });
});
