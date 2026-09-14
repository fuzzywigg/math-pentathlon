/**
 * Wave 54 leftover after #240/#241 — FIAR tutorial strategy-tips copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 54 fiar — tutorial strategy tips', () => {
  it('strategy-tips covers block / threats / center', () => {
    expect(fiarTutorial.id).toBe('fiar-basics');
    expect(fiarTutorial.name).toBe('Learn FIAR');
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/Block opponent/);
    expect(step?.message).toMatch(/multiple winning threats/);
    expect(step?.message).toMatch(/center of the board/);
  });
});
