/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro history h4 + list chrome.
 * Wave49/55 cover DOM titles/moves; deepen inject h4/list leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject history h4/list', () => {
  it('history h4 is #666 0.9rem; list stacks with 0.25rem gap', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-history h4');
    expect(css).toContain('margin: 0 0 0.5rem 0');
    expect(css).toContain('color: #666');
    expect(css).toContain('.kwa-history-list');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('gap: 0.25rem');
    expect(css).toContain('font-size: 0.8rem');
  });
});
