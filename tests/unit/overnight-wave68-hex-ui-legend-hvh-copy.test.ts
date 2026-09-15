/**
 * Wave 68 leftover after tip/#336 — Hex status legend HvH copy exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

describe('Wave 68 hex — UI legend HvH copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('human-vs-human legend locks Blue/Red Top↔Bottom Left↔Right', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const state = createInitialState();
    renderStatus(state, root, 'human-vs-human');
    const html = root.innerHTML;
    expect(html).toContain('Blue: Top ↔ Bottom');
    expect(html).toContain('Red: Left ↔ Right');
  });
});
