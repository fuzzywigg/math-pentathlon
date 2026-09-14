/**
 * Wave 59 leftover after #279 — Ramrod valid green / selected orange ring CSS.
 * Distinct from wave58 board wood bg. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 59 ramrod — inject valid selected rings', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects green valid slot and orange selected rod rings', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.ramrod-slot\.valid\s*\{[^}]*box-shadow:\s*0 0 0 2px #4caf50/
    );
    expect(css).toContain('.ramrod-rod-wrapper.selected');
    expect(css).toContain('background: rgba(255,152,0,0.3)');
    expect(css).toMatch(
      /\.ramrod-rod-wrapper\.selected\s*\{[^}]*box-shadow:\s*0 0 0 2px #ff9800/
    );
  });
});
