/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro selectable-chip transition.
 * Wave60 locks hover scale/brightness; deepen base transition. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject chip transition', () => {
  it('selectable-chip transitions all 0.15s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-selectable-chip');
    expect(css).toContain('transition: all 0.15s');
  });
});
