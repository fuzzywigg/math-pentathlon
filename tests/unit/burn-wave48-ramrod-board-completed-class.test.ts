/**
 * Wave 48 — Ramrod completed box CSS class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — completed class', () => {
  it('marks completed.player1 on captured box', () => {
    const s = createInitialState();
    const a: Rod = { id: 'a', length: 3, color: '#7cb342', owner: 'player1', position: { boxId: 'box-0-2', slot: 0 } };
    const b: Rod = { id: 'b', length: 4, color: '#8e24aa', owner: 'player1', position: { boxId: 'box-0-2', slot: 1 } };
    const rods = new Map(s.rods);
    rods.set(a.id, a);
    rods.set(b.id, b);
    const boxes = new Map(s.boxes);
    const box = boxes.get('box-0-2')!;
    boxes.set(box.id, { ...box, rods: [a, b], completedBy: 'player1' } as SumBox);
    const el = renderBoard({ ...s, boxes, rods }, () => undefined);
    const completed = el.querySelector('.ramrod-box.completed.player1');
    expect(completed).not.toBeNull();
  });
});
