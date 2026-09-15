/**
 * Wave 65 leftover after tip/#315 — Juggle dice-values strong face numbers.
 * Wave64 locked cell labels; strong 1/2/3/4/5-6 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial dice strong faces', () => {
  it('locks strong face numbers on dice-values step', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.title).toBe('Dice Values');
    expect(step?.message).toContain('<strong>1</strong>');
    expect(step?.message).toContain('<strong>2</strong>');
    expect(step?.message).toContain('<strong>3</strong>');
    expect(step?.message).toContain('<strong>4</strong>');
    expect(step?.message).toContain('<strong>5-6</strong>');
  });
});
