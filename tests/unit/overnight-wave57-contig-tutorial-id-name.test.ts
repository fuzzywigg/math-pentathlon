/**
 * Wave 57 leftover after #267 — Contig tutorial id/name. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 57 contig — tutorial id name', () => {
  it('pins contig-60-basics id and Learn Contig 60 name', () => {
    expect(contig60Tutorial.id).toBe('contig-60-basics');
    expect(contig60Tutorial.name).toBe('Learn Contig 60');
  });
});
