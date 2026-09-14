/**
 * Wave 63 Contig/SD residual after tip #301 — Contig × Sum inject rgba handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 handshake — contig × sum inject rgba', () => {
  it('mounts residual inject rgba + default cursor leftovers', () => {
    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toContain('rgba(0,0,0,0.15)');
    expect(sumCss).toContain('rgba(0,0,0,0.3)');
    expect(sumCss).toContain('cursor: default');
    expect(contigCss).toContain('margin: 0 auto');
  });
});
