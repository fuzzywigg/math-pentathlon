/**
 * Wave 58 leftover after #267 — Queens drop-shadow + qg-glow keyframes.
 * Distinct from status/info CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.getElementById('qg-styles')?.remove();
});

describe('Wave 58 queens — inject drop-shadow glow', () => {
  it('embeds svg drop-shadow and @keyframes qg-glow', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/drop-shadow/);
    expect(css).toMatch(/@keyframes qg-glow/);
  });
});
