/**
 * Wave 58 leftover after #275 — Sum inject pip 4px size. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — inject pip 4px size', () => {
  it('pins leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-pip');
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?width:\s*4px/);
  });
});
