/**
 * Overnight TOKENMAXX HEAVY — graph demo exact template Nodes/Edges leftovers.
 * Distinct from #202 presence-level template matrix. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

function parseCounts(info: string): { nodes: number; edges: number } {
  const nodes = Number(/Nodes:\s*(\d+)/i.exec(info)?.[1] ?? NaN);
  const edges = Number(/Edges:\s*(\d+)/i.exec(info)?.[1] ?? NaN);
  return { nodes, edges };
}

describe('Overnight demos45 — graph template exact counts', () => {
  it('star / hex / track / complete report exact Nodes and Edges', () => {
    const root = mount();
    renderGraphDemo(root);

    const expected: Record<string, { nodes: number; edges: number }> = {
      star: { nodes: 7, edges: 6 },
      hex: { nodes: 19, edges: 42 },
      track: { nodes: 10, edges: 9 },
      complete: { nodes: 5, edges: 10 },
      circular: { nodes: 8, edges: 8 },
      grid: { nodes: 16, edges: 24 },
    };

    for (const [name, counts] of Object.entries(expected)) {
      (
        root.querySelector(
          `.template-btn[data-template="${name}"]`
        ) as HTMLButtonElement
      ).click();
      const info = root.querySelector('#template-info')?.textContent ?? '';
      const parsed = parseCounts(info);
      expect(parsed.nodes).toBe(counts.nodes);
      expect(parsed.edges).toBe(counts.edges);
      expect(info).toMatch(/Connected:\s*Yes/i);
    }
  });
});
