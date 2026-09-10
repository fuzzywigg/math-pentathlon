import { describe, it, expect } from 'vitest';
import {
  resolveInspectTarget,
  stubNarrationFor,
  inspectDropSpeech,
} from '../../src/core/owl/ollie-inspect-map';

describe('Ollie inspect map (Cycle-2 B STUB)', () => {
  it('resolves Kings cells via data-row/data-col', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = '3';
    cell.dataset.col = '5';
    document.body.appendChild(cell);

    const target = resolveInspectTarget(cell);
    expect(target).toEqual({ kind: 'kings-cell', row: 3, col: 5 });
    expect(stubNarrationFor(target)).toContain('[STUB inspect]');
    expect(stubNarrationFor(target)).toContain('row 3');
    expect(stubNarrationFor(target)).toContain('column 5');

    cell.remove();
  });

  it('resolves Hex cells via .hex-cell-group', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hex-cell-group');
    g.setAttribute('data-row', '1');
    g.setAttribute('data-col', '2');
    document.body.appendChild(g);

    expect(resolveInspectTarget(g)).toEqual({ kind: 'hex-cell', row: 1, col: 2 });
    g.remove();
  });

  it('resolves FIAR nodes via data-node-id', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-node-id', 'n42');
    document.body.appendChild(g);

    expect(resolveInspectTarget(g)).toEqual({ kind: 'fiar-node', nodeId: 'n42' });
    g.remove();
  });

  it('resolves Hex-a-Gone cells and bank shapes', () => {
    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hex.setAttribute('data-q', '0');
    hex.setAttribute('data-r', '-1');
    document.body.appendChild(hex);
    expect(resolveInspectTarget(hex)).toEqual({ kind: 'hex-a-gone-cell', q: 0, r: -1 });
    hex.remove();

    const btn = document.createElement('button');
    btn.setAttribute('data-shape', 'triangle');
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({ kind: 'hex-a-gone-bank', shape: 'triangle' });
    expect(inspectDropSpeech(btn)).toContain('triangle');
    btn.remove();
  });

  it('resolves Star Track spaces and pieces', () => {
    const space = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    space.setAttribute('class', 'star-track-space');
    space.setAttribute('data-space', '4');
    space.setAttribute('data-player', 'player1');
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 4,
      player: 'player1',
    });
    space.remove();

    const piece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    piece.setAttribute('class', 'star-track-piece');
    piece.setAttribute('data-player', 'player2');
    document.body.appendChild(piece);
    expect(resolveInspectTarget(piece)).toEqual({ kind: 'star-piece', player: 'player2' });
    piece.remove();
  });

  it('resolves How-to / chrome controls', () => {
    const row = document.createElement('div');
    row.className = 'button-row';
    const help = document.createElement('button');
    help.id = 'help-btn';
    help.textContent = 'How to Play';
    row.appendChild(help);
    document.body.appendChild(row);

    expect(resolveInspectTarget(help)).toEqual({ kind: 'chrome', chrome: 'howto' });
    expect(stubNarrationFor({ kind: 'chrome', chrome: 'howto' })).toContain('How to Play');

    row.remove();
  });

  it('labels unknown drops as STUB', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const speech = inspectDropSpeech(el);
    expect(speech.startsWith('[STUB inspect]')).toBe(true);
    el.remove();
  });
});
