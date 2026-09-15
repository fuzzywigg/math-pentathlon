/**
 * Wave 64 leftover after #305 — Fab op-btn border-radius chrome.
 * Wave63 pins 0.75rem 1.25rem pad; deepen 8px radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject op-btn radius', () => {
  it('op buttons use 8px border-radius', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-btn');
    expect(css).toContain('border-radius: 8px');
  });
});
