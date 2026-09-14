/**
 * Overnight TOKENMAXX — FIAR injectFiarStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

beforeEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Overnight fiar — inject styles', () => {
  it('idempotent single style tag', () => {
    injectFiarStyles();
    injectFiarStyles();
    expect(document.querySelectorAll('#fiar-styles')).toHaveLength(1);
    expect(document.getElementById('fiar-styles')!.textContent).toMatch(/fiar/i);
  });
});
