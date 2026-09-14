/**
 * Overnight HEAVY leftover after #264 — null element → unknown stub speech.
 * Distinct from wave40 resolve null without speech assert. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

describe('Wave 57 core owl — inspect null', () => {
  it('null resolves unknown and stub speech', () => {
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
    expect(inspectDropSpeech(null)).toMatch(/don't recognize that spot/i);
  });
});
