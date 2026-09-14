/**
 * Wave 55 leftover after #250 — Par 55 tutorial identity + winning/strategy/blocks copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { par55Tutorial } from '../../src/games/par-55/tutorial';

describe('Wave 55 par55 — tutorial catalog', () => {
  it('id/name, aim for 55, winning, strategy, attribute blocks', () => {
    expect(par55Tutorial.id).toBe('par-55-basics');
    expect(par55Tutorial.name).toBe('Learn Par 55');
    expect(par55Tutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(
      /aim for 55/
    );
    expect(par55Tutorial.steps.find((s) => s.id === 'winning')?.message).toMatch(
      /First player to reach 55/
    );
    expect(par55Tutorial.steps.find((s) => s.id === 'strategy-tips')?.message).toMatch(
      /Place blocks near multiple occupied bases/
    );
    const blocks = par55Tutorial.steps.find((s) => s.id === 'attribute-blocks');
    expect(blocks?.message).toMatch(/Hexagon/);
    expect(blocks?.message).toMatch(/Yellow/);
    expect(blocks?.message).toMatch(/Thick/);
    expect(blocks?.highlightSelector).toBe('.par55-hand');
    expect(blocks?.position).toBe('bottom');
  });
});
