/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro board second gradient stop + shadow.
 * Wave57 asserts #e8d4b8 only; deepen #d4c4a8 + box-shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject board shadow / gradient stop', () => {
  it('board uses second stop #d4c4a8 and 0 4px 12px shadow', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-board');
    expect(css).toContain('linear-gradient(135deg, #e8d4b8, #d4c4a8)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.2)');
  });
});
