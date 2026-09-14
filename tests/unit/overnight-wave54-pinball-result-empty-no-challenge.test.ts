/**
 * Wave 54 leftover after #240 — Pinball result empty without challenge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — result empty no challenge', () => {
  it('stays empty in showResult when currentChallenge is null', () => {
    const el = renderResult(
      { ...createInitialState(), phase: 'showResult', currentChallenge: null },
      () => undefined
    );
    expect(el.classList.contains('pinball-result')).toBe(true);
    expect(el.children.length).toBe(0);
  });
});
