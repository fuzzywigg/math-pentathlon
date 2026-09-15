/**
 * Wave 66 leftover after tip/#316 — Sum strategy high-pip exact li.
 * Soft high-pip regex existed; lock Try to play exact sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial strategy high pip exact', () => {
  it('strategy-tips locks Try to play high-pip exact li', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Try to play high-pip dominoes first');
    expect(step?.position).toBe('center');
  });
});
