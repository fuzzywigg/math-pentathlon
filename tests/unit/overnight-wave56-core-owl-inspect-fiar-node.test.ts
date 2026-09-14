/**
 * Overnight HEAVY leftover after #256 — [data-node-id] FIAR inspect leftover.
 * Distinct from wave55 new-game / wave52 empty shape. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect fiar-node', () => {
  it('data-node-id resolves fiar-node speech', () => {
    const node = document.createElement('div');
    node.setAttribute('data-node-id', 'n7');
    document.body.appendChild(node);
    expect(resolveInspectTarget(node)).toEqual({
      kind: 'fiar-node',
      nodeId: 'n7',
    });
    expect(inspectDropSpeech(node)).toMatch(/FIAR node n7/i);
  });
});
