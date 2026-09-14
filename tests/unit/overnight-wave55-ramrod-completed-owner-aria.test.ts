/**
 * Wave 55 leftover after #250 — Ramrod completed box aria owner name.
 * Distinct from wave52 completed class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard, getPlayerName } from '../../src/games/ramrod/board-ui';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 55 ramrod — completed owner aria', () => {
  it('empty remaining slot still announces Red when P2 completed the box', () => {
    const s = createInitialState();
    const box = s.boxes.get('box-2-3')!;
    const r1: Rod = {
      id: 'p2a',
      length: 4,
      color: '#8e24aa',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    const done: SumBox = {
      ...box,
      rods: [r1, null],
      completedBy: 'player2',
    };
    const boxes = new Map(s.boxes);
    boxes.set(box.id, done);
    const el = renderBoard({ ...s, boxes }, () => undefined);
    const labels = [...el.querySelectorAll('.ramrod-box.completed.player2 .ramrod-slot')].map(
      (n) => n.getAttribute('aria-label') ?? ''
    );
    expect(labels.some((l) => l.includes(getPlayerName('player2')))).toBe(true);
  });
});
