/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Kings piece size + king radius.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 58 kings — renderer piece king radius', () => {
  it('piece 80% size and king border-radius 8px leftover', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('.piece');
    expect(css).toContain('width: 80%');
    expect(css).toContain('height: 80%');
    expect(css).toContain('.piece.king');
    expect(css).toContain('border-radius: 8px');
  });
});
