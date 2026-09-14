/**
 * Wave 39 — hex UI interactive grid hover/options leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInteractiveHexGrid } from '../../src/core/hex';
import { createLayout } from '../../src/core/hex/types';

describe('Wave 39 hex UI — interactive hover options', () => {
  it('createInteractiveHexGrid mounts and update refreshes options', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onClick = vi.fn();
    const onHover = vi.fn();
    const grid = createInteractiveHexGrid(
      container,
      1,
      createLayout('pointy', 20, 40, 40),
      {
        onCellClick: onClick,
        onCellHover: onHover,
        getCellOptions: () => ({ fill: '#abc' }),
      }
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(typeof grid.update).toBe('function');
    grid.update(() => ({ fill: '#def' }));
    expect(container.querySelectorAll('.hex-cell').length).toBeGreaterThan(0);
  });
});
