/**
 * Overnight TOKENMAXX — Hex renderStatus HvH leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

describe('Overnight hex — renderStatus HvH', () => {
  it('shows Blue turn text', () => {
    const container = document.createElement('div');
    const s = createInitialState(5);
    renderStatus(s, container, 'human-vs-human');
    expect(container.textContent).toMatch(/Blue/i);
    expect(container.textContent).toMatch(/turn/i);
  });
});
