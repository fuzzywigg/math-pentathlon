/**
 * Wave 54 leftover after #237 — FIAR node Enter/Space leftover (wave52 click). Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — node keyboard', () => {
  it('Enter/Space invoke onNodeClick', () => {
    const onClick = vi.fn();
    const svg = renderBoard(createInitialState(), onClick);
    const g = svg.querySelector('[data-node-id="1-1"]')!;
    g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    g.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith('1-1');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
