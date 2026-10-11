/**
 * Hermetic coverage for phase-2 export `--check` baseline ceiling resolution
 * (q-mp-1266): missing / non-numeric `outOfScopeErrors` must fail closed.
 */
import { describe, it, expect } from 'vitest';
import { resolvePhase2PrevOutOfScopeTotal } from '../../docs/dev/type-ratchet-phase2-export.mjs';

describe('resolvePhase2PrevOutOfScopeTotal (q-mp-1266)', () => {
  it('accepts top-level numeric outOfScopeErrors', () => {
    expect(resolvePhase2PrevOutOfScopeTotal({ outOfScopeErrors: 216 })).toEqual(
      {
        ok: true,
        total: 216,
      }
    );
  });

  it('accepts nested totals.outOfScopeErrors when top-level omitted', () => {
    expect(
      resolvePhase2PrevOutOfScopeTotal({ totals: { outOfScopeErrors: 216 } })
    ).toEqual({ ok: true, total: 216 });
  });

  it('prefers top-level number over nested totals', () => {
    expect(
      resolvePhase2PrevOutOfScopeTotal({
        outOfScopeErrors: 200,
        totals: { outOfScopeErrors: 216 },
      })
    ).toEqual({ ok: true, total: 200 });
  });

  it('fails closed when outOfScopeErrors is omitted', () => {
    const r = resolvePhase2PrevOutOfScopeTotal({ inScopeErrors: 0 });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('expected fail');
    expect(r.error).toMatch(/omits numeric outOfScopeErrors/);
    // Historical fail-open: current > undefined is false.
    expect(216 > (undefined as unknown as number)).toBe(false);
  });

  it('fails closed for non-numeric / non-finite values', () => {
    expect(
      resolvePhase2PrevOutOfScopeTotal({ outOfScopeErrors: '216' }).ok
    ).toBe(false);
    expect(
      resolvePhase2PrevOutOfScopeTotal({ outOfScopeErrors: null }).ok
    ).toBe(false);
    expect(resolvePhase2PrevOutOfScopeTotal({ outOfScopeErrors: NaN }).ok).toBe(
      false
    );
    expect(
      resolvePhase2PrevOutOfScopeTotal({
        totals: { outOfScopeErrors: '216' },
      }).ok
    ).toBe(false);
  });

  it('fails closed for non-object baselines', () => {
    expect(resolvePhase2PrevOutOfScopeTotal(null).ok).toBe(false);
    expect(resolvePhase2PrevOutOfScopeTotal(undefined).ok).toBe(false);
    expect(resolvePhase2PrevOutOfScopeTotal(216).ok).toBe(false);
  });
});
