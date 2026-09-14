/**
 * Wave 48 — Juggle renderShapeSelector empty without category. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — shape selector empty', () => {
  it('returns empty container without dice/category', () => {
    const el = renderShapeSelector(createInitialState(), () => undefined);
    expect(el.className).toBe('juggle-shape-selector');
    expect(el.children.length).toBe(0);
  });
});
