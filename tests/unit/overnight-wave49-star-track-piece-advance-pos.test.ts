/**
 * Wave 49 — Star Track piece cx/cy after advance leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — piece advance position', () => {
  it('moves p1 piece cy closer to center when position advances', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.appendChild(a);
    document.body.appendChild(b);
    renderBoard(createInitialState(), a);
    const mid = Math.floor(TRACK_LENGTH / 2);
    renderBoard({ ...createInitialState(), player1Position: mid }, b);
    const y0 = Number(a.querySelector('.star-track-piece-p1')!.getAttribute('cy'));
    const y1 = Number(b.querySelector('.star-track-piece-p1')!.getAttribute('cy'));
    expect(y1).toBeGreaterThan(y0); // top path moves downward toward center
  });
});
