/**
 * Wave 49 leftover after #221/#226/#227 — Contig injectContigStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — inject styles', () => {
  beforeEach(() => document.getElementById('contig-styles')?.remove());
  it('injects once under #contig-styles', () => {
    injectContigStyles();
    injectContigStyles();
    expect(document.querySelectorAll('#contig-styles')).toHaveLength(1);
  });
});
