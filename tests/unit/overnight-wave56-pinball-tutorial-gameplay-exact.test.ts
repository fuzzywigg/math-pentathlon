/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball gameplay title/list leftover.
 * Wave55 matched /lose a ball/i. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — gameplay exact', () => {
  it('Gameplay title + convert/hit/lose-ball leftovers', () => {
    const step = fractionPinballTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.title).toBe('Gameplay');
    expect(step?.highlightSelector).toBe('.pinball-challenge');
    expect(step?.position).toBe('bottom');
    expect(step?.message).toMatch(
      /convert a fraction to decimal or decimal to fraction/
    );
    expect(step?.message).toMatch(/hit pinball targets for points/);
    expect(step?.message).toMatch(/Wrong answers lose a ball/);
  });
});
