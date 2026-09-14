/**
 * Wave 41 handshake — Prime Gold roll phase × core dice roller.
 * Game×core using real exports. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  rollDice,
} from '../../src/games/prime-gold/rules';
import { rollDie, rollDice as coreRollDice } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 handshake — prime × dice roll phase', () => {
  it('prime rollDice leaves rolling→placing with three dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const idle = createInitialState();
    expect(idle.phase).toBe('rolling');
    expect(idle.diceRoll).toBeNull();

    const rolled = rollDice(idle);
    expect(rolled.phase).toBe('placing');
    expect(rolled.diceRoll).not.toBeNull();
    expect(rolled.diceRoll!.die1).toBeGreaterThanOrEqual(1);
    expect(rolled.diceRoll!.die2).toBeGreaterThanOrEqual(1);
    expect(rolled.diceRoll!.die3).toBeGreaterThanOrEqual(1);

    // Identity when already placing
    expect(rollDice(rolled)).toBe(rolled);
  });

  it('core roller produces die values compatible with prime-style rolls', () => {
    let i = 0;
    const seq = [0.0, 0.2, 0.4, 0.6, 0.8, 0.15, 0.35, 0.55];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });
    const d6 = rollDie('d6');
    expect(d6.value).toBeGreaterThanOrEqual(1);
    expect(d6.value).toBeLessThanOrEqual(6);
    const trio = coreRollDice({ dice: ['d6', 'd6', 'd6'] });
    expect(trio.rolls).toHaveLength(3);
    for (const die of trio.rolls) {
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(6);
    }
  });
});
