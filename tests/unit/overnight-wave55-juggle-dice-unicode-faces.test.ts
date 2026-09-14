/**
 * Wave 55 leftover after #250 — Juggle renderDice unicode faces 1–6.
 * Adjacent to wave48 two-die mount; distinct from open #251 calla cubes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — dice unicode faces', () => {
  it('maps 1–6 onto ⚀–⚅ without a roll CTA', () => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;
    for (let v = 1; v <= 6; v++) {
      const other = v === 6 ? 1 : 6;
      const el = renderDice([v, other], () => undefined, () => undefined, false, 'placing');
      const texts = [...el.querySelectorAll('.juggle-die')].map((d) => d.textContent);
      expect(texts).toContain(faces[v - 1]);
      expect(el.querySelector('.juggle-roll-btn')).toBeNull();
    }
  });
});
