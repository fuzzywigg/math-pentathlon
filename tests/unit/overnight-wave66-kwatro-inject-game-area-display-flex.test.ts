/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject game-area display flex.
 * Wave63 locks column/gap/pad; deepen display: flex scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject game-area display flex', () => {
  it('game-area is display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?display:\s*flex/);
  });
});
