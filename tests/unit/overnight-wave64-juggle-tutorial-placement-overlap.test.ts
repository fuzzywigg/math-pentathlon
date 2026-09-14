/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle placement overlap copy.
 * Wave62 locked fit entirely; lock cannot-overlap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial placement overlap', () => {
  it('locks cannot-overlap and rotate/flip placement bullets', () => {
    const msg =
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')?.message ??
      '';
    expect(msg).toContain(
      'Shapes cannot overlap with previously placed shapes'
    );
    expect(msg).toContain('Shapes can be rotated and flipped');
  });
});
