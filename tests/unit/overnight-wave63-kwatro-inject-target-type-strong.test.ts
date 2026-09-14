/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro target-info type + strong.
 * Wave60 locks #f5f5f5 bg; deepen 0.9rem/#666 + strong #333. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject target type/strong', () => {
  it('target-info is 0.9rem #666 with strong #333', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-target-info');
    expect(css).toContain('font-size: 0.9rem');
    expect(css).toContain('color: #666');
    expect(css).toContain('.kwa-target-info strong');
    expect(css).toContain('color: #333');
  });
});
