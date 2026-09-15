/**
 * Wave 67 leftover after tip/#316 — Sum hand flex-wrap leftover.
 * Soft pad/gap/radius existed; lock display flex + flex-wrap wrap. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject hand flex wrap', () => {
  it('pins sd-hand display flex + flex-wrap wrap + max-width 300', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?max-width:\s*300px/);
  });
});
