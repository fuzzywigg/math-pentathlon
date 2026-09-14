/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum selected orange CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject selected orange', () => {
  it('selected hand domino orange ring leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-hand-domino-selected');
    expect(css).toContain('box-shadow: 0 0 0 3px #ff9800');
    expect(css).toContain('translateY(-4px)');
  });
});
