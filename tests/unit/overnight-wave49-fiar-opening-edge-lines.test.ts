/**
 * Wave 49 — FIAR opening edge lines leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — edge lines', () => {
  it('draws at least one board edge line on opening', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelectorAll('line').length).toBeGreaterThan(0);
  });
});
