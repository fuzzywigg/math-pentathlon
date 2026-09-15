/**
 * Wave 68 leftover after tip/#336 — Kwatro chip text y cy+5 offset.
 * Wave67 locked font chrome; deepen y offset leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render chip text y offset', () => {
  it('chip text y is node.y + 5', () => {
    const state = createInitialState();
    const node = state.nodes.get('n0-0')!;
    const el = renderBoard(state, () => undefined, () => undefined);
    const text = el.querySelector('[data-node-id="n0-0"] text');
    expect(text?.getAttribute('y')).toBe(String(node.y + 5));
  });
});
