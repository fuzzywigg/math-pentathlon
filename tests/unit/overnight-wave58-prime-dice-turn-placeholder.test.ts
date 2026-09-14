/**
 * Wave 58 leftover after #267 — Prime Blue's Turn + ? dice pre-roll.
 * Distinct from Valid Moves leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderDice } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — dice turn placeholder', () => {
  it("opening dice area shows Blue's Turn and three ?", () => {
    const el = renderDice(createInitialState(), () => undefined);
    expect(el.querySelector('strong')?.textContent).toBe("Blue's Turn");
    const dice = [...el.querySelectorAll('.pg-die')].map((d) => d.textContent);
    expect(dice).toEqual(['?', '?', '?']);
  });
});
