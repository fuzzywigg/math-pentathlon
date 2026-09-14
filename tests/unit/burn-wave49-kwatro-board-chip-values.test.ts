/**
 * Wave 49 — Kwatro board chip value text leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — chip values', () => {
  it('renders chip value labels on opening board', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined, () => undefined);
    const texts = [...el.querySelectorAll('text')].map((t) => t.textContent);
    for (const v of ['0', '2', '4', '6', '8', '1', '3', '5', '7', '9']) {
      expect(texts).toContain(v);
    }
  });
});
