/**
 * Wave 67 leftover after tip/#324 — Kwatro chip-info display flex.
 * Wave63 locks gap/pad/radius; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject chip-info display flex', () => {
  it('chip-info uses display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-chip-info\s*\{[\s\S]*?display:\s*flex/);
  });
});
