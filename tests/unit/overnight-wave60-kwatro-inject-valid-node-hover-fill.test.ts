/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro valid-node hover fill.
 * Distinct from wave57 selectable-chip:hover presence. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject valid-node hover', () => {
  it('valid-node:hover fills #a5d6a7 !important', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-valid-node:hover');
    expect(css).toContain('fill: #a5d6a7 !important');
  });
});
