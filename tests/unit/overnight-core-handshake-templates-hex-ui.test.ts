/**
 * Overnight TOKENMAXX — graph templates render + hex grid coexist in DOM.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import { createStarGraph, createHexLatticeGraph } from '../../src/core/graph/types';
import { renderHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core handshake — templates × hex-ui', () => {
  it('star graph svg and hex grid svg mount together', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.appendChild(renderGraph(createStarGraph(3), undefined, { showLabels: true }));
    host.appendChild(renderHexGrid(1, createLayout('pointy', 16), { showCoords: true }));
    expect(host.querySelectorAll('.graph-view')).toHaveLength(1);
    expect(host.querySelectorAll('.hex-cell')).toHaveLength(7);
    expect(host.querySelectorAll('.graph-node')).toHaveLength(4);
  });

  it('hex lattice graph renders without throwing', () => {
    const svg = renderGraph(createHexLatticeGraph(1), undefined, {
      showLabels: false,
      nodeRadius: 8,
    });
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(7);
  });
});
