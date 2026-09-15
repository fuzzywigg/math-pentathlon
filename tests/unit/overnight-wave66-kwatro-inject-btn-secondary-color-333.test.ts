/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject btn-secondary color #333.
 * Wave60 locks #e0e0e0 fill / #bdbdbd hover; deepen color: #333. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn-secondary color #333', () => {
  it('secondary text is #333', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-secondary\s*\{[\s\S]*?color:\s*#333/);
  });
});
