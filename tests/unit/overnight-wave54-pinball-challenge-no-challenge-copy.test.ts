/**
 * Wave 54 leftover after #240 — Pinball empty-challenge copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — no-challenge copy', () => {
  it('uses exact No challenge loaded text', () => {
    const el = renderChallenge(createInitialState(), () => undefined);
    expect(el.querySelector('.pinball-no-challenge')?.textContent).toBe(
      'No challenge loaded'
    );
  });
});
