/**
 * Wave 49 — Star Track hvh progress Blue/Red exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — progress labels exact', () => {
  it('shows Blue/Red progress values at opening', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialState(), el, 'human-vs-human');
    expect(el.querySelector('.progress-p1 .progress-label')?.textContent).toMatch(/Blue/);
    expect(el.querySelector('.progress-p2 .progress-label')?.textContent).toMatch(/Red/);
    expect(el.querySelector('.progress-p1 .progress-value')?.textContent).toBe(`0/${TRACK_LENGTH}`);
  });
});
