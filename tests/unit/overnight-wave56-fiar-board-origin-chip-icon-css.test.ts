/**
 * Wave 56 leftover after #255/#256 — FIAR board origin + chip-icon CSS size. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createFiarBoard } from '../../src/games/fiar/types';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — board origin + chip-icon CSS', () => {
  it('anchors 0-0 at 200/100 and paints 16px chip icons', () => {
    const board = createFiarBoard();
    const origin = board.nodes.get('0-0')!;
    expect(origin.x).toBe(200);
    expect(origin.y).toBe(100);
    expect(board.nodes.get('1-0')!.y).toBe(180);
    expect(board.nodes.get('0-1')!.x).toBe(280);

    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chip-icon');
    expect(css).toContain('width: 16px');
    expect(css).toContain('height: 16px');
    expect(css).toContain('border-radius: 50%');
  });
});
