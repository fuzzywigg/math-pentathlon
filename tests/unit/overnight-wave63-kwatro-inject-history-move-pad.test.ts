/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro history-move pad/radius.
 * Wave60 locks seat tint backgrounds; deepen move row pad/radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject history-move pad', () => {
  it('history-move pads 0.25rem 0.5rem with 4px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-history-move');
    expect(css).toContain('padding: 0.25rem 0.5rem');
    expect(css).toContain('border-radius: 4px');
  });
});
