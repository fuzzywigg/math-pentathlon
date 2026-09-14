/**
 * Wave 49 — Star-track status AI thinking class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — thinking', () => {
  it('adds status-ai-thinking', () => {
    const box = document.createElement('div');
    renderStatus(createInitialState(), box, 'human-vs-ai', true);
    expect(box.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(box.textContent).toMatch(/thinking/i);
  });
});
