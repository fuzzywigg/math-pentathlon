/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro media column center.
 * Wave55 names @media 768px; deepen flex-direction + align-items. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject media column center', () => {
  it('narrow media stacks main-layout column centered', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('align-items: center');
  });
});
