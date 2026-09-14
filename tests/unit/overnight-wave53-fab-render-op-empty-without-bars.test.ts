/**
 * Wave 53 leftover after #235 — Fab op selector empty without bars. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — op empty', () => {
  it('returns empty selector shell when bars missing', () => {
    const el = renderOperationSelector(createInitialState(), () => undefined);
    expect(el.classList.contains('fab-operation-selector')).toBe(true);
    expect(el.querySelector('.fab-operation-preview')).toBeNull();
    expect(el.querySelectorAll('.fab-op-btn').length).toBe(0);
  });
});
