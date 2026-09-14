/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro btn pad/radius.
 * Wave60 locks primary/secondary fills; deepen shared .kwa-btn chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject btn pad/radius', () => {
  it('btn pads 0.75rem 1.5rem with 6px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-btn');
    expect(css).toContain('padding: 0.75rem 1.5rem');
    expect(css).toContain('border-radius: 6px');
    expect(css).toContain('cursor: pointer');
  });
});
