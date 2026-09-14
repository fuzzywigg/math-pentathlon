/**
 * Wave 49 leftover after #221/#226/#227 — Handshake inject style ids across engines. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 handshake — inject ids', () => {
  beforeEach(() => {
    for (const id of ['kwa-styles', 'par55-styles', 'qg-styles', 'contig-styles', 'fiar-styles', 'sd-styles']) {
      document.getElementById(id)?.remove();
    }
  });
  it('each style id present once after inject', () => {
    injectKwaStyles();
    injectPar55Styles();
    injectQGStyles();
    injectContigStyles();
    injectFiarStyles();
    injectSDStyles();
    injectKwaStyles();
    expect(document.getElementById('kwa-styles')).toBeTruthy();
    expect(document.getElementById('par55-styles')).toBeTruthy();
    expect(document.getElementById('qg-styles')).toBeTruthy();
    expect(document.getElementById('contig-styles')).toBeTruthy();
    expect(document.getElementById('fiar-styles')).toBeTruthy();
    expect(document.getElementById('sd-styles')).toBeTruthy();
  });
});
