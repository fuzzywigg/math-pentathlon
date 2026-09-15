/**
 * Wave 68 leftover after tip/#337 — Sum hand flex-wrap wrap.
 * Soft display flex existed; lock flex-wrap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject hand flex wrap', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?flex-wrap:\s*wrap/);
  });
});
