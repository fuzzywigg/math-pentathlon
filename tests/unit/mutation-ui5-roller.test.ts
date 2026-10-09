/**
 * q-mp-202 mutation audit UI wave 5 — kill survivors in core/dice/roller.
 * Pins generateId radix/substring bounds — no AI/scoring asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { rollDie, rollMultiple } from '../../src/core/dice/roller';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mutation-ui5 roller generateId', () => {
  it('id length is exactly 7 from substring(2, 9)', () => {
    // Survivors: L14 NumericBoundary on substring start/end (2/9 → ±1).
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    const ids = Array.from({ length: 5 }, () => rollDie('d6').id);
    for (const id of ids) {
      expect(id.length).toBe(7);
    }
    const multi = rollMultiple('d6', 3);
    for (const die of multi.rolls) {
      expect(die.id.length).toBe(7);
    }
  });

  it('id radix is 36 (can emit z; radix 35 cannot)', () => {
    // Survivor: L14 NumericBoundary 36 → 35 on toString radix.
    // 0.999…toString(36) includes `z`; toString(35) never does.
    vi.spyOn(Math, 'random').mockReturnValue(0.999999999999);
    const id = rollDie('d20').id;
    expect(id.length).toBe(7);
    expect(id).toMatch(/z/);
  });

  it('substring start index is exactly 2 (drops 0. prefix only)', () => {
    // Survivors: L14 NumericBoundary 2 → 1 / 2 → 3.
    // Math.random stub → known toString(36) payload after "0.".
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const raw = (0.5).toString(36); // "0.i…"
    const expected = raw.substring(2, 9);
    const id = rollDie('d6').id;
    expect(id).toBe(expected);
    expect(id.startsWith(raw.charAt(1))).toBe(false); // not substring(1,…)
    expect(id).not.toBe(raw.substring(3, 9));
  });
});
