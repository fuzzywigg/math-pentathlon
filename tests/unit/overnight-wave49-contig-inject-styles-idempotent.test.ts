/**
 * Wave 49 — Contig injectContigStyles double-call leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 49 contig — inject styles', () => {
  it('second inject keeps a single #contig-styles node', () => {
    injectContigStyles();
    injectContigStyles();
    expect(document.querySelectorAll('#contig-styles')).toHaveLength(1);
  });
});
