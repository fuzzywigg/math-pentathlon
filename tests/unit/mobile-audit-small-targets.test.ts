/**
 * @vitest-environment node
 *
 * Hermetic coverage for mobile-audit small-tap shaping (q-mp-1240).
 * Count must match the deduped listed targets (not raw pre-dedupe length).
 */
import { describe, it, expect } from 'vitest';
import {
  SMALL_TAP_TARGET_LIST_CAP,
  shapeSmallTapTargets,
} from '../../scripts/lib/mobile-audit-small-targets.mjs';

function tap(
  tag: string,
  cls: string,
  w: number,
  h: number
): { tag: string; class: string; w: number; h: number; id: null; aria: null } {
  return { tag, class: cls, w, h, id: null, aria: null };
}

describe('shapeSmallTapTargets (q-mp-1240)', () => {
  it('keeps count equal to listed unique targets when raw length is higher', () => {
    const raw = [
      tap('button', 'btn', 20, 20),
      tap('button', 'btn', 20, 20),
      tap('a', 'link', 30, 30),
      tap('a', 'link', 30, 30),
      tap('button', 'other', 22, 22),
    ];
    const shaped = shapeSmallTapTargets(raw);
    expect(raw.length).toBe(5);
    expect(shaped.smallTapTargets).toHaveLength(3);
    expect(shaped.smallTapTargetCount).toBe(3);
    expect(shaped.smallTapTargetCount).toBe(shaped.smallTapTargets.length);
    expect(shaped.smallTapTargets.map((t) => t.class)).toEqual([
      'btn',
      'link',
      'other',
    ]);
  });

  it('caps the listed sample and keeps count equal to the capped list', () => {
    const raw = Array.from({ length: SMALL_TAP_TARGET_LIST_CAP + 5 }, (_, i) =>
      tap('button', `c${i}`, 10, 10)
    );
    const shaped = shapeSmallTapTargets(raw);
    expect(shaped.smallTapTargets).toHaveLength(SMALL_TAP_TARGET_LIST_CAP);
    expect(shaped.smallTapTargetCount).toBe(SMALL_TAP_TARGET_LIST_CAP);
    expect(shaped.smallTapTargetCount).toBe(shaped.smallTapTargets.length);
  });

  it('returns empty list and zero count for no small targets', () => {
    const shaped = shapeSmallTapTargets([]);
    expect(shaped.smallTapTargets).toEqual([]);
    expect(shaped.smallTapTargetCount).toBe(0);
  });
});
