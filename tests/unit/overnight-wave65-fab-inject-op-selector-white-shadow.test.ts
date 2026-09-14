/**
 * Wave 65 leftover after tip/#305 — Fab operation-selector white + shadow.
 * Soft panel card shadow existed; lock selector white bg leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject op selector white shadow', () => {
  it('operation-selector uses white background and soft shadow', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-operation-selector\s*\{[\s\S]*?background:\s*white[\s\S]*?box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
