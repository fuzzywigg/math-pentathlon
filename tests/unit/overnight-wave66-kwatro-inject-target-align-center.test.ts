/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject target align.
 * Wave63 locks type/strong; deepen text-align center scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject target align', () => {
  it('target-info is text-align center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[\s\S]*?text-align:\s*center/);
  });
});
