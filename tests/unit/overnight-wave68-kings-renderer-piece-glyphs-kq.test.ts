/**
 * Wave 68 leftover after tip/#336 — Kings renderer K/Q glyphs on initial board. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer piece glyphs KQ', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('initial board renders two K glyphs for kings', () => {
    const el = renderBoard(createInitialBoard());
    const kings = el.querySelectorAll('.piece.king');
    expect(kings.length).toBe(2);
    expect([...kings].every((k) => k.textContent === 'K')).toBe(true);
  });
});
