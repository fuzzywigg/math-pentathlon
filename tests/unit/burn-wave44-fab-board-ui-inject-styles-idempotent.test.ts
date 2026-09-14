/**
 * Wave 44 overnight HEAVY — Fab injectFabStyles idempotent.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 44 fab board-ui — styles', () => {
  it('injects once', () => {
    injectFabStyles();
    injectFabStyles();
    expect(document.querySelectorAll('#fab-styles')).toHaveLength(1);
    expect(document.getElementById('fab-styles')!.textContent).toContain('fab-game-area');
  });
});
