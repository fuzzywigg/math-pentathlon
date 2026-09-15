/**
 * Wave 65 leftover after tip/#315 — Juggle placement highlight + title.
 * Wave64 locked fit-entirely; highlight/title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial placement highlight', () => {
  it('locks Placement Rules title and boards highlight', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.title).toBe('Placement Rules');
    expect(step?.highlightSelector).toBe('.juggle-boards');
    expect(step?.position).toBe('top');
  });
});
