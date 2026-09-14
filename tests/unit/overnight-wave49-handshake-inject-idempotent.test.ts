/**
 * Wave 49 — Contig/Queens/FIAR inject idempotent handshake leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
  document.getElementById('qg-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 49 handshake — inject idempotent', () => {
  it('double-inject keeps one style node each', () => {
    injectContigStyles();
    injectContigStyles();
    injectQGStyles();
    injectQGStyles();
    injectFiarStyles();
    injectFiarStyles();
    expect(document.querySelectorAll('#contig-styles')).toHaveLength(1);
    expect(document.querySelectorAll('#qg-styles')).toHaveLength(1);
    expect(document.querySelectorAll('#fiar-styles')).toHaveLength(1);
  });
});
