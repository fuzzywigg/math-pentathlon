/**
 * Wave 49 — Kwatro renderBoard node count leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — renderBoard', () => {
  it('renders board container with svg nodes for board size', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined, () => undefined);
    expect(el.classList.contains('kwa-board')).toBe(true);
    const svg = el.querySelector('svg.kwa-svg');
    expect(svg).toBeTruthy();
    const groups = el.querySelectorAll('[data-node-id], .kwa-node, g');
    expect(groups.length).toBeGreaterThanOrEqual(s.nodes.size);
  });
});
