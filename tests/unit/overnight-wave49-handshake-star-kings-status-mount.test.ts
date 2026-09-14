/**
 * Wave 49 — Star/Kings status mount handshake leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderStatus as renderStar } from '../../src/games/star-track/board-ui';
import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus as renderKings } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 handshake — star/kings status', () => {
  it('both status renders mount without throw', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.appendChild(a);
    document.body.appendChild(b);
    renderStar(createStar(), a);
    renderKings(createKings(), b);
    expect(a.querySelector('.star-track-status')).toBeTruthy();
    expect(b.querySelector('.status')).toBeTruthy();
  });
});
