/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 scores panel chrome.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject scores panel', () => {
  it('scores panel #333 and target #999 leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-scores');
    expect(css).toContain('background: #333');
    expect(css).toContain('.par55-target');
    expect(css).toContain('color: #999');
  });
});
