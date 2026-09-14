/**
 * Wave 48 overnight — Ramrod board Need:N hint on half-filled box. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod overnight — Need hint', () => {
  it('shows Need: remaining on empty slot of partial box', () => {
    const s = createInitialState();
    const partner: Rod = {
      id: 'p',
      length: 3,
      color: '#7cb342',
      owner: 'player1',
      position: { boxId: 'box-0-2', slot: 0 },
    };
    const rods = new Map(s.rods);
    rods.set(partner.id, partner);
    const boxes = new Map(s.boxes);
    const box = boxes.get('box-0-2')!;
    boxes.set(box.id, { ...box, rods: [partner, null] } as SumBox);
    const el = renderBoard({ ...s, boxes, rods }, () => undefined);
    const hint = el.querySelector('.ramrod-hint');
    expect(hint).not.toBeNull();
    expect(hint!.textContent).toBe('Need: 4');
  });
});
