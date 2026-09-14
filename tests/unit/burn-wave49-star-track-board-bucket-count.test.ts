/**
 * Wave 49 — Star-track bucket info text. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — bucket info', () => {
  it('shows chainBucket length', () => {
    const s = createInitialState();
    const box = document.createElement('div');
    renderBoard(s, box, () => {});
    expect(box.querySelector('.star-track-bucket-info')?.textContent).toContain(
      String(s.chainBucket.length)
    );
  });
});
