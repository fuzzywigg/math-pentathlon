/**
 * Wave 44 — lockDice blocks reroll leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, lockDice, unlockDice, rerollDice } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

function incrementalRandom() {
  let n = 0;
  return vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 97) / 97;
  });
}

describe('Wave 44 dice — lock skips reroll', () => {
  it('locked die keeps value and id across reroll', () => {
    incrementalRandom();
    let r = rollDice({ dice: ['d6', 'd6'] });
    const lockedId = r.rolls[0].id;
    const lockedVal = r.rolls[0].value;
    const otherId = r.rolls[1].id;
    r = lockDice(r, [lockedId]);
    r = rerollDice(r, [lockedId, otherId]);
    const locked = r.rolls.find((d) => d.id === lockedId)!;
    expect(locked.value).toBe(lockedVal);
    expect(locked.isLocked).toBe(true);
    expect(r.rolls[1].id).not.toBe(otherId);
  });

  it('unlock then reroll replaces die id', () => {
    incrementalRandom();
    let r = rollDice({ dice: ['d20'] });
    const id = r.rolls[0].id;
    r = lockDice(r, [id]);
    r = unlockDice(r, [id]);
    expect(r.rolls[0].isLocked).toBe(false);
    r = rerollDice(r, [id]);
    expect(r.rolls[0].id).not.toBe(id);
    expect(r.rolls[0].value).toBeGreaterThanOrEqual(1);
    expect(r.rolls[0].value).toBeLessThanOrEqual(20);
  });
});
