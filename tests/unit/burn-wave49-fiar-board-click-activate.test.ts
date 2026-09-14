/**
 * Wave 49 — FIAR node click callback leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — click activate', () => {
  it('forwards node id on click', () => {
    const onClick = vi.fn();
    const svg = renderBoard(createInitialState(), onClick);
    const g = svg.querySelector('[data-node-id="2-2"]')!;
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith('2-2');
  });
});
