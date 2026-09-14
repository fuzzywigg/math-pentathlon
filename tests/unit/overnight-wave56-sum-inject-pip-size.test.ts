/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum pip size CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject pip size', () => {
  it('pip 4px circle translate leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-pip');
    expect(css).toContain('width: 4px');
    expect(css).toContain('height: 4px');
    expect(css).toContain('border-radius: 50%');
    expect(css).toContain('translate(-50%, -50%)');
  });
});
