/**
 * Wave 60 leftover after #282 — Sum pip height/black/radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject pip height black', () => {
  it('pins height color radius transform leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?height:\s*4px/);
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?background:\s*#111/);
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?border-radius:\s*50%/);
    expect(css).toMatch(/translate\(-50%, -50%\)/);
  });
});
