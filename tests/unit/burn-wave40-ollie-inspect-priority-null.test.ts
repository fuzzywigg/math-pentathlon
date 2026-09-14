/**
 * Wave 40 — ollie inspect null target / priority nesting / non-finite leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { resolveInspectTarget } from '../../src/core/owl';

describe('Wave 40 ollie-inspect — null / priority / non-finite', () => {
  const mounted: Element[] = [];

  afterEach(() => {
    mounted.splice(0).forEach((el) => el.remove());
  });

  function add(el: Element): Element {
    document.body.appendChild(el);
    mounted.push(el);
    return el;
  }

  it('null target resolves to unknown', () => {
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
  });

  it('hex-a-gone bank wins over nested axial cell attrs', () => {
    const bank = document.createElement('button');
    bank.setAttribute('data-shape', 'hexagon');
    const cell = document.createElement('span');
    cell.setAttribute('data-q', '1');
    cell.setAttribute('data-r', '2');
    bank.appendChild(cell);
    add(bank);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'hexagon',
    });
  });

  it('hex-cell-group wins over nested Kings .cell attrs', () => {
    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hex.setAttribute('class', 'hex-cell-group');
    hex.setAttribute('data-row', '2');
    hex.setAttribute('data-col', '3');
    const kings = document.createElement('div');
    kings.className = 'cell';
    kings.setAttribute('data-row', '9');
    kings.setAttribute('data-col', '9');
    hex.appendChild(kings);
    add(hex);
    expect(resolveInspectTarget(kings)).toEqual({
      kind: 'hex-cell',
      row: 2,
      col: 3,
    });
  });

  it('non-finite axial / row-col attrs fall through to unknown', () => {
    const hag = document.createElement('div');
    hag.setAttribute('data-q', 'NaN');
    hag.setAttribute('data-r', '1');
    add(hag);
    expect(resolveInspectTarget(hag)).toEqual({ kind: 'unknown' });

    const kings = document.createElement('div');
    kings.className = 'cell';
    kings.setAttribute('data-row', 'Infinity');
    kings.setAttribute('data-col', '2');
    add(kings);
    expect(resolveInspectTarget(kings)).toEqual({ kind: 'unknown' });

    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hex.setAttribute('class', 'hex-cell-group');
    hex.setAttribute('data-row', 'abc');
    hex.setAttribute('data-col', '1');
    add(hex);
    expect(resolveInspectTarget(hex)).toEqual({ kind: 'unknown' });
  });

  it('non-finite star space falls through; missing player defaults unknown', () => {
    const space = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    space.setAttribute('class', 'star-track-space');
    space.setAttribute('data-space', 'not-a-number');
    add(space);
    expect(resolveInspectTarget(space)).toEqual({ kind: 'unknown' });

    const piece = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    piece.setAttribute('class', 'star-track-piece');
    piece.setAttribute('data-player', '');
    add(piece);
    // empty string is truthy for getAttribute? actually '' is returned, || 'unknown'
    // getAttribute returns '' which is falsy → 'unknown'
    expect(resolveInspectTarget(piece)).toEqual({
      kind: 'star-piece',
      player: 'unknown',
    });
  });

  it('fiar node without id attribute is skipped', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-node-id', '');
    add(g);
    // empty string is falsy → no match → unknown
    expect(resolveInspectTarget(g)).toEqual({ kind: 'unknown' });
  });
});
