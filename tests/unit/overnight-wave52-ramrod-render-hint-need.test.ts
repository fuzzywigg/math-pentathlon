/**
 * Overnight HEAVY leftover after #234 — Ramrod Need: hint on partial box. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 52 ramrod — Need hint', () => {
  it('shows Need: remaining when one slot is filled', () => {
    const s = createInitialState();
    const box = s.boxes.get('box-0-0')!;
    const rod: Rod = {
      id: 'hint-rod',
      length: 2,
      color: '#e53935',
      owner: 'player1',
      position: { boxId: box.id, slot: 0 },
    };
    const boxes = new Map(s.boxes);
    const partial: SumBox = { ...box, rods: [rod, null] };
    boxes.set(box.id, partial);
    const el = renderBoard({ ...s, boxes }, () => undefined);
    const hint = el.querySelector('.ramrod-hint');
    expect(hint).toBeTruthy();
    expect(hint?.textContent).toBe(`Need: ${box.targetSum - 2}`);
  });
});
