/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro valid-node transition.
 * Wave60 locks hover fill; deepen unsaturated transition body. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject valid-node transition', () => {
  it('valid-node transitions all 0.2s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-valid-node');
    expect(css).toContain('transition: all 0.2s');
  });
});
