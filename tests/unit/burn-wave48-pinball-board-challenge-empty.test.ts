/**
 * Wave 48 — Pinball renderChallenge empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderChallenge } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — challenge empty', () => {
  it('shows no-challenge when null', () => {
    const el = renderChallenge(createInitialState(), () => undefined);
    expect(el.querySelector('.pinball-no-challenge')).toBeTruthy();
  });
});
