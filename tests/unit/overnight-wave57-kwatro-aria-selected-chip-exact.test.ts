/**
 * Wave 57 leftover after #263 — Kwatro selected chip aria extras. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 57 kwatro — selected aria', () => {
  it('selected chip node aria includes selected + chip N', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    const el = renderBoard(selected, () => undefined, () => undefined);
    const aria =
      el.querySelector('[data-node-id="n0-0"]')?.getAttribute('aria-label') ?? '';
    expect(aria).toMatch(/selected/);
    expect(aria).toMatch(/chip \d+/);
  });
});
