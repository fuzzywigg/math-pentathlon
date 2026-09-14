/**
 * Wave 49 — Kwatro chipInfo ignores state leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderChipInfo } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — chipInfo static', () => {
  it('catalog text stable regardless of winner flag', () => {
    const a = renderChipInfo(createInitialState()).textContent;
    const b = renderChipInfo({ ...createInitialState(), winner: 'player2' }).textContent;
    expect(a).toBe(b);
  });
});
