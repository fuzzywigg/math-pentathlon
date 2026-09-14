/**
 * Wave 49 — Handshake inject styles across queens/fiar/kwatro/par55. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 49 handshake — inject four', () => {
  beforeEach(() => {
    for (const id of ['qg-styles', 'fiar-styles', 'kwa-styles', 'par55-styles']) {
      document.getElementById(id)?.remove();
    }
  });
  it('each style id present once', () => {
    injectQGStyles();
    injectFiarStyles();
    injectKwaStyles();
    injectPar55Styles();
    injectQGStyles();
    expect(document.getElementById('qg-styles')).toBeTruthy();
    expect(document.getElementById('fiar-styles')).toBeTruthy();
    expect(document.getElementById('kwa-styles')).toBeTruthy();
    expect(document.getElementById('par55-styles')).toBeTruthy();
    expect(document.querySelectorAll('#qg-styles').length).toBe(1);
  });
});
