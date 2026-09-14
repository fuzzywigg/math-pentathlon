/**
 * Overnight HEAVY leftover after #234 — Ramrod completed box chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 52 ramrod — completed box', () => {
  it('adds completed + seat class when box.completedBy set', () => {
    const s = createInitialState();
    const box = s.boxes.get('box-1-1')!;
    const r1: Rod = {
      id: 'c1',
      length: 3,
      color: '#7cb342',
      owner: 'player1',
      position: { boxId: box.id, slot: 0 },
    };
    const r2: Rod = {
      id: 'c2',
      length: box.targetSum - 3,
      color: '#8e24aa',
      owner: 'player1',
      position: { boxId: box.id, slot: 1 },
    };
    const boxes = new Map(s.boxes);
    const done: SumBox = {
      ...box,
      rods: [r1, r2],
      completedBy: 'player1',
    };
    boxes.set(box.id, done);
    const el = renderBoard({ ...s, boxes }, () => undefined);
    const completed = [...el.querySelectorAll('.ramrod-box.completed.player1')];
    expect(completed.length).toBeGreaterThanOrEqual(1);
    expect(completed.some((b) => b.textContent?.includes(`Sum: ${box.targetSum}`))).toBe(
      true
    );
  });
});
