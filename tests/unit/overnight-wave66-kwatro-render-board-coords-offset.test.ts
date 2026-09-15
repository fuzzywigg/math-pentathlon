/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro board OFFSET/SPACING coords.
 * Wave42 locks connection topology; deepen n0-0 / n1-0 pixel coords. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 66 kwatro — board coords offset', () => {
  it('n0-0 is 60,60 and n1-0 is 60,140 (OFFSET 60 / SPACING 80)', () => {
    const nodes = createInitialState().nodes;
    expect(nodes.get('n0-0')).toMatchObject({ x: 60, y: 60 });
    expect(nodes.get('n1-0')).toMatchObject({ x: 60, y: 140 });
    expect(nodes.get('n0-1')).toMatchObject({ x: 140, y: 60 });
    expect(nodes.get('n2-2')).toMatchObject({ x: 220, y: 220 });
  });
});
