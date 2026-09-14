/**
 * Wave 56 leftover after #243 — Sum Dominoes dice-area class residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — dice area class', () => {
  it('wraps null-roll and faces in .sd-dice-area', () => {
    expect(renderDice(null, () => undefined, true).className).toBe('sd-dice-area');
    expect(renderDice([2, 5], () => undefined, false).className).toBe('sd-dice-area');
    expect(
      renderDice([2, 5], () => undefined, false).querySelector('.sd-dice-display')
    ).toBeTruthy();
  });
});
