/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro primary btn gradient + hover.
 * Wave56 only asserts class presence; deepen gradient + lift shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject btn-primary gradient', () => {
  it('primary uses blue gradient and hover lift shadow', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-btn-primary');
    expect(css).toContain('linear-gradient(135deg, #2196f3, #1976d2)');
    expect(css).toContain('.kwa-btn-primary:hover');
    expect(css).toContain('transform: translateY(-2px)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(33,150,243,0.3)');
  });
});
