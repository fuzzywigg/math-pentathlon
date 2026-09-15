/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject chip-info display flex.
 * Wave63 locks gap/pad/radius; deepen display: flex scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject chip-info display flex', () => {
  it('chip-info is display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-chip-info\s*\{[\s\S]*?display:\s*flex/);
  });
});
