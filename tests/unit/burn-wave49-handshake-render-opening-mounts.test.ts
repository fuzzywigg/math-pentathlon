/**
 * Wave 49 leftover after #221/#226/#227 — Handshake opening board mounts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { createInitialState as createQg } from '../../src/games/queens-guards/types';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';
import { renderBoard as renderPar } from '../../src/games/par-55/board-ui';
import { renderBoard as renderQg } from '../../src/games/queens-guards/board-ui';
import { renderBoard as renderContig } from '../../src/games/contig-60/board-ui';
import { renderBoard as renderFiar } from '../../src/games/fiar/board-ui';

describe('Wave 49 handshake — opening mounts', () => {
  it('each board render returns a mounted element', () => {
    expect(renderKwa(createKwa(), () => undefined, () => undefined).querySelector('svg')).toBeTruthy();
    expect(renderPar(createPar(), () => undefined).querySelector('svg')).toBeTruthy();
    expect(renderQg(createQg(), () => undefined).tagName.toLowerCase()).toBe('svg');
    expect(renderContig(createContig(), () => undefined).classList.contains('contig-board')).toBe(true);
    expect(renderFiar(createFiar(), () => undefined).tagName.toLowerCase()).toBe('svg');
  });
});
