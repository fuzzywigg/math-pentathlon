/**
 * Wave 32 — rollDie face-bound matrix under controlled Math.random.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { rollDie, DICE_FACES, type DiceType } from '../../src/core/dice';

function stubRandom(kind: 'min' | 'max' | 'mid' = 'min'): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    if (kind === 'min') return (i % 10_000) * 1e-7;
    if (kind === 'mid') return 0.5 + (i % 100) * 1e-9;
    return 0.999999 - (i % 10_000) * 1e-12;
  });
}

const ALL_TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice — rollDie low/high bounds', () => {
  it.each(ALL_TYPES)('%s maps near-zero random to face 1', (type) => {
    stubRandom('min');
    const die = rollDie(type);
    expect(die.value).toBe(1);
    expect(die.diceType).toBe(type);
    expect(die.isSelected).toBe(false);
    expect(die.isLocked).toBe(false);
  });

  it.each(ALL_TYPES)('%s maps near-one random to max face', (type) => {
    stubRandom('max');
    const die = rollDie(type);
    expect(die.value).toBe(DICE_FACES[type]);
  });
});

describe('Wave 32 dice — rollDie mid-face landing', () => {
  beforeEach(() => {
    // 0.5 → floor(0.5 * faces) + 1
    stubRandom('mid');
  });

  it.each(ALL_TYPES)('%s lands on floor(faces/2)+1', (type) => {
    const die = rollDie(type);
    expect(die.value).toBe(Math.floor(0.5 * DICE_FACES[type]) + 1);
  });
});

describe('Wave 32 dice — rollDie identity fields', () => {
  it('assigns unique ids and monotonic-ish timestamps', () => {
    stubRandom('mid');
    const a = rollDie('d6');
    const b = rollDie('d6');
    expect(a.id).not.toBe(b.id);
    expect(a.id.length).toBeGreaterThan(0);
    expect(b.id.length).toBeGreaterThan(0);
    expect(a.timestamp).toBeLessThanOrEqual(Date.now());
    expect(b.timestamp).toBeLessThanOrEqual(Date.now());
  });
});
