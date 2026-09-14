/**
 * Wave 63 Contig/SD residual after tip #301 — Contig passing step has no highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 63 contig — tutorial passing highlight none', () => {
  it('pins passing/winning/complete center with no highlightSelector', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.passing?.position).toBe('center');
    expect(byId.winning?.position).toBe('center');
    expect(byId.complete?.position).toBe('center');
    expect(byId.passing?.highlightSelector).toBeUndefined();
    expect(byId.winning?.highlightSelector).toBeUndefined();
    expect(byId.complete?.highlightSelector).toBeUndefined();
  });
});
