/**
 * q-mp-548 mutation audit UI wave 19 — ollie-inspect-map first-window kills.
 * Structural resolveInspectTarget pins only — no player-facing stub copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { resolveInspectTarget } from '../../src/core/owl/ollie-inspect-map';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mutation-ui19 ollie-inspect-map', () => {
  // Dropped null→unknown pin: already owned by tip-folded #1002 / engine r19.

  it('hex-a-gone cell requires both q and r finite (kills L49 &&→||)', () => {
    const ok = document.createElement('div');
    ok.setAttribute('data-q', '2');
    ok.setAttribute('data-r', '-1');
    document.body.appendChild(ok);
    expect(resolveInspectTarget(ok)).toEqual({
      kind: 'hex-a-gone-cell',
      q: 2,
      r: -1,
    });

    const badR = document.createElement('div');
    badR.setAttribute('data-q', '2');
    badR.setAttribute('data-r', 'nan');
    document.body.appendChild(badR);
    expect(resolveInspectTarget(badR)).toEqual({ kind: 'unknown' });

    const badQ = document.createElement('div');
    badQ.setAttribute('data-q', 'oops');
    badQ.setAttribute('data-r', '3');
    document.body.appendChild(badQ);
    expect(resolveInspectTarget(badQ)).toEqual({ kind: 'unknown' });
  });

  it('star piece empty player falls back via || (kills L57 ||→&&)', () => {
    // star-space L65 player||unknown already pinned by tip-folded #1002 / engine r19.
    const piece = document.createElement('div');
    piece.className = 'star-track-piece';
    piece.setAttribute('data-player', '');
    document.body.appendChild(piece);
    expect(resolveInspectTarget(piece)).toEqual({
      kind: 'star-piece',
      player: 'unknown',
    });
  });

  it('hex cell requires both row and col finite (kills L85 &&→||)', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hex-cell-group');
    g.setAttribute('data-row', '1');
    g.setAttribute('data-col', '2');
    document.body.appendChild(g);
    expect(resolveInspectTarget(g)).toEqual({
      kind: 'hex-cell',
      row: 1,
      col: 2,
    });

    const bad = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bad.setAttribute('class', 'hex-cell-group');
    bad.setAttribute('data-row', '1');
    bad.setAttribute('data-col', 'x');
    document.body.appendChild(bad);
    expect(resolveInspectTarget(bad)).toEqual({ kind: 'unknown' });
  });

  it('kings cell requires both row and col finite (kills L95 &&→||)', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-row', '3');
    cell.setAttribute('data-col', '5');
    document.body.appendChild(cell);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'kings-cell',
      row: 3,
      col: 5,
    });

    const bad = document.createElement('div');
    bad.className = 'cell';
    bad.setAttribute('data-row', 'nan');
    bad.setAttribute('data-col', '5');
    document.body.appendChild(bad);
    expect(resolveInspectTarget(bad)).toEqual({ kind: 'unknown' });
  });
});
