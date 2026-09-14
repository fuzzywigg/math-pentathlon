/**
 * Wave 49 — Star Track hvai You/AI progress leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — You/AI progress', () => {
  it('relabels progress to You/AI in human-vs-ai mode', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialState(), el, 'human-vs-ai');
    expect(el.querySelector('.progress-p1 .progress-label')?.textContent).toMatch(/You/);
    expect(el.querySelector('.progress-p2 .progress-label')?.textContent).toMatch(/AI/);
  });
});
