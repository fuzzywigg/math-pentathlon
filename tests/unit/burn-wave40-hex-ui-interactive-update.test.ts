/**
 * Wave 40 — hex-ui interactive update / hover leave / flat vs pointy path leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  hexPath,
  getHexCorners,
  createInteractiveHexGrid,
  type HexLayout,
} from '../../src/core/hex';

const pointy: HexLayout = {
  orientation: 'pointy',
  size: 20,
  origin: { x: 0, y: 0 },
};

const flat: HexLayout = {
  orientation: 'flat',
  size: 20,
  origin: { x: 0, y: 0 },
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 hex-ui — interactive update + path orientation', () => {
  it('flat vs pointy hexPath first vertices diverge', () => {
    const center = { x: 10, y: 10 };
    const pointyD = hexPath(center, 12, false);
    const flatD = hexPath(center, 12, true);
    expect(pointyD).not.toBe(flatD);
    const pc = getHexCorners(center, 12, false);
    const fc = getHexCorners(center, 12, true);
    expect(pc[0].x).not.toBeCloseTo(fc[0].x, 5);
  });

  it('update remounts cells with new fill options', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveHexGrid(host, 0, pointy);
    expect(host.querySelector('path')?.getAttribute('fill')).toBe('#e0e0e0');
    api.update(() => ({ fill: '#ff00aa' }));
    expect(host.querySelector('path')?.getAttribute('fill')).toBe('#ff00aa');
    expect(host.querySelectorAll('.hex-cell')).toHaveLength(1);
  });

  it('hover enter then leave clears getHoveredCell', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const hovered: Array<{ q: number; r: number } | null> = [];
    const api = createInteractiveHexGrid(host, 0, flat, {
      onCellHover: (c) => hovered.push(c),
    });
    const cell = host.querySelector('.hex-cell') as SVGGElement;
    cell.dispatchEvent(new Event('mouseenter'));
    expect(api.getHoveredCell()).toEqual({ q: 0, r: 0 });
    cell.dispatchEvent(new Event('mouseleave'));
    expect(api.getHoveredCell()).toBeNull();
    expect(hovered.at(-1)).toBeNull();
  });

  it('onCellClick fires through interactive wrapper', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const clicks: string[] = [];
    createInteractiveHexGrid(host, 0, pointy, {
      onCellClick: (c) => clicks.push(`${c.q},${c.r}`),
    });
    (host.querySelector('.hex-cell') as SVGGElement).dispatchEvent(
      new Event('click')
    );
    expect(clicks).toEqual(['0,0']);
  });

  it('layout orientation selects flat path when orientation is flat', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveHexGrid(host, 0, flat);
    const d = host.querySelector('path')?.getAttribute('d') ?? '';
    const expected = hexPath(
      { x: flat.origin.x, y: flat.origin.y },
      flat.size,
      true
    );
    // Same closed-path structure; flat start angle differs from pointy
    expect(d.endsWith(' Z')).toBe(true);
    expect(d.split('L ').length).toBe(expected.split('L ').length);
    const pointyHost = document.createElement('div');
    createInteractiveHexGrid(pointyHost, 0, pointy);
    expect(pointyHost.querySelector('path')?.getAttribute('d')).not.toBe(d);
  });
});
