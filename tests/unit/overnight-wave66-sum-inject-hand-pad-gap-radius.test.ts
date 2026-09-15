/**
 * Wave 66 leftover after tip/#316 — Sum hand pad/gap/radius leftover.
 * Soft rgba bg / max-width existed; lock padding/gap/radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject hand pad gap radius', () => {
  it('pins sd-hand padding 1rem gap 0.5rem radius 8px', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?padding:\s*1rem/);
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?gap:\s*0\.5rem/);
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
