/**
 * Overnight HEAVY leftover after #234 — polyhedral polygon point geometry.
 * Wave39 catalog checked class + text only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDie, type DieRoll, type DiceType } from '../../src/core/dice';

function die(type: DiceType, value: number): DieRoll {
  return {
    id: `${type}-${value}`,
    diceType: type,
    value,
    isSelected: false,
    isLocked: false,
    timestamp: 1,
  };
}

describe('Wave 52 dice-ui — polygon points', () => {
  it('matches source geometry strings for d4/d8/d12/d20', () => {
    expect(renderDie(die('d4', 3), 48).querySelector('polygon')?.getAttribute('points')).toBe(
      '50,10 90,85 10,85'
    );
    expect(renderDie(die('d8', 5), 48).querySelector('polygon')?.getAttribute('points')).toBe(
      '50,5 95,50 50,95 5,50'
    );
    expect(renderDie(die('d12', 7), 48).querySelector('polygon')?.getAttribute('points')).toBe(
      '50,5 95,38 77,90 23,90 5,38'
    );
    expect(renderDie(die('d20', 11), 48).querySelector('polygon')?.getAttribute('points')).toBe(
      '50,5 90,25 90,75 50,95 10,75 10,25'
    );
  });
});
