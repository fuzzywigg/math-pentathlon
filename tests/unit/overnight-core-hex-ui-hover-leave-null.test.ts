/**
 * Overnight TOKENMAXX — interactive hover enter/leave nulls getHoveredCell.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInteractiveHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight core hex-ui — hover leave null', () => {
  it('hover enter sets cell; leave clears; update re-renders', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const hovers: Array<string | null> = [];
    const grid = createInteractiveHexGrid(host, 1, createLayout('pointy', 20), {
      onCellHover: (c) => hovers.push(c ? `${c.q},${c.r}` : null),
      onCellClick: () => {},
    });
    expect(grid.getHoveredCell()).toBeNull();
    const cell = host.querySelector('.hex-cell') as SVGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new Event('mouseenter'));
    expect(grid.getHoveredCell()).not.toBeNull();
    cell.dispatchEvent(new Event('mouseleave'));
    expect(grid.getHoveredCell()).toBeNull();
    expect(hovers).toContain(null);

    grid.update(() => ({ fill: '#abc' }));
    expect(host.querySelectorAll('.hex-cell')).toHaveLength(7);
    expect(
      host.querySelector('.hex-cell path')?.getAttribute('fill')
    ).toBe('#abc');
  });
});
